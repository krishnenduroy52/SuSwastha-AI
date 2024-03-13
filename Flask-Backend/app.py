from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer, GenerationConfig
import torch
import tensorflow as tf
from flask_cors import CORS

app = Flask(__name__)
app.debug = True
CORS(app)

# Model Path
# model_path = "./biogpt"
# tokenizer_path = "./biogpt"
# tokenizer = AutoTokenizer.from_pretrained(tokenizer_path)
# model = AutoModelForCausalLM.from_pretrained(model_path)

# Download from Huggingface
model_id = "Narrativaai/BioGPT-Large-finetuned-chatdoctor"
tokenizer = AutoTokenizer.from_pretrained("microsoft/BioGPT-Large")
model = AutoModelForCausalLM.from_pretrained(model_id)


# model.to("cuda")

def answer_question(
        prompt,
        temperature=0.1,
        top_p=0.75,
        top_k=40,
        num_beams=2,
        **kwargs,
):
    inputs = tokenizer(prompt, return_tensors="pt")
    input_ids = inputs["input_ids"]
    attention_mask = inputs["attention_mask"]
    generation_config = GenerationConfig(
        temperature=temperature,
        top_p=top_p,
        top_k=top_k,
        num_beams=num_beams,
        **kwargs,
    )
    with torch.no_grad():
        generation_output = model.generate(
            input_ids=input_ids,
            attention_mask=attention_mask,
            generation_config=generation_config,
            return_dict_in_generate=True,
            output_scores=True,
            max_new_tokens=512,
            eos_token_id=tokenizer.eos_token_id
        )
    s = generation_output.sequences[0]
    output = tokenizer.decode(s, skip_special_tokens=True)
    return output.split(" Response:")[1]


@app.route("/generate", methods=["POST"])
def generate_text():
    try:
        data = request.get_json()
        prompt = data["prompt"]
        max_length = data.get("max_length", 50)  # You can adjust the max length as needed
        inputPrompt = """Below is an instruction that describes a task, paired with an input that provides further context.Write a response that appropriately completes the request.
        
        ### Instruction:
        If you are a doctor, please answer the medical questions based on the patient's description.

        ### Input:
        """+prompt+"""

        ### Response:"""
        with tf.device('/GPU:0'):
            generated_text = answer_question(prompt)

        return jsonify({"generated_text": generated_text})

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/', methods=['GET'])
def welcome():
    return "Hi"


if __name__ == '__main__':
    app.run(port=8000)
