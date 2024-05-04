import React, { useState } from "react";
import scale from "../../assets/Images/bmi.png";
import needle from "../../assets/Images/needle.png";
import bmi from "../../assets/Images/weight.png";
import obese from "../../assets/Images/obese.jpg";
import under from "../../assets/Images/underweight.png";
import "./bmi.css";

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [bmiResult, setBMIResult] = useState(null);

  const calculateBMI = () => {
    if (!weight || !heightCm) {
      alert("Please enter both weight and height.");
      return;
    }

    const weightInKg = parseFloat(weight);
    const heightInM = parseFloat(heightCm) / 100; // Convert cm to meters

    if (
      isNaN(weightInKg) ||
      isNaN(heightInM) ||
      weightInKg <= 0 ||
      heightInM <= 0
    ) {
      alert("Please enter valid weight and height.");
      return;
    }

    const bmi = weightInKg / (heightInM * heightInM);
    setBMIResult(bmi.toFixed(2));
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.0) {
      return "Underweight";
    } else if (bmi >= 18.0 && bmi < 25) {
      return "Normal weight";
    } else if (bmi >= 25 && bmi < 30) {
      return "Overweight";
    } else {
      return "Obese";
    }
  };

  const bmiToDegrees = (bmi) => {
    let degrees = 0;
    const maxAngle = 180; // Semi circle
    const maxBMI = 40; // Maximum BMI value for the scale

    const normalizedBMI = Math.min(Math.max(parseFloat(bmi), 0), maxBMI);

    if (normalizedBMI <= 17.9) {
      degrees = (normalizedBMI / 17.9) * 30; // Mapping 0 to 17.9 BMI to 0 to 30 degrees
    } else if (normalizedBMI <= 24.9) {
      degrees = 36 + ((normalizedBMI - 18) / 7.9) * 60; // Mapping 18 to 24.9 BMI to 31 to 90 degrees
    } else if (normalizedBMI <= 29.9) {
      degrees = 83 + ((normalizedBMI - 25) / 4.9) * 60; // Mapping 25 to 29.9 BMI to 91 to 150 degrees
    } else {
      degrees = 146 + ((normalizedBMI - 30) / 10) * 30; // Mapping 30 to 40 BMI to 151 to 180 degrees
    }

    return degrees;
  };

  return (
    <div style={{ margin: "5%" }}>
      <div style={{ display: "flex", justifyContent: "center", margin: "5%" }}>
        <div style={{ marginRight: "20px" }}>
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "30px",
              border: "2px solid #ef7f1a",
              borderRadius: "8px",
              maxWidth: "400px",
            }}
          >
            <div
              classNameName="header"
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={bmi}
                alt=""
                srcset=""
                style={{ width: "70px", marginRight: "10px" }}
              />
              <h2
                style={{
                  color: "#ef7f1a",
                  textAlign: "center",
                  marginBottom: "30px",
                  paddingTop: "20px",
                }}
              >
                BMI Calculator
              </h2>
            </div>

            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* <img
              src="https://via.placeholder.com/50"
              alt="Weight Icon"
              style={{ width: "30px", marginRight: "10px" }}
            /> */}
              <input
                type="number"
                placeholder="Weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={{
                  padding: "10px",
                  width: "100%",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              />
            </div>
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* <img
              src="https://via.placeholder.com/50"
              alt="Height Icon"
              style={{ width: "30px", marginRight: "10px" }}
            /> */}
              <input
                type="number"
                placeholder="Height (cm)"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                style={{
                  padding: "10px",
                  width: "100%",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              />
            </div>
            <button
              onClick={calculateBMI}
              style={{
                backgroundColor: "#ef7f1a",
                color: "white",
                border: "none",
                padding: "15px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
                marginBottom: "20px",
              }}
            >
              Calculate BMI
            </button>
            {/* {bmiResult && (
            <div
              style={{ textAlign: "center", fontSize: "20px", color: "#168c46" }}
            >
              <p>Your BMI: {bmiResult}</p>
              <p>Your status: {getBMIStatus(parseFloat(bmiResult))}</p>
            </div>
          )} */}
          </div>
        </div>

        {/* BMI Scale */}
        {bmiResult === null ? (
          setBMIResult(0)
        ) : (
          <div
            classNameName="scale-container"
            style={{ paddingTop: "8%", paddingLeft: "8%" }}
          >
            <div style={{ position: "relative" }}>
              <div classNameName="Image">
                <img src={scale} alt="" style={{ marginBottom: "40px" }} />

                <img
                  src={needle}
                  alt=""
                  style={{
                    height: "22px",
                    position: "absolute",
                    right: "153px",
                    bottom: `${bmiResult === 0 ? "0px" : "110px"}`,
                    // transform: "rotate(150deg)",
                    transformOrigin: "100% 50%",
                    transition: "transform 1s",
                    WebkitTransition: "transform 1s",
                    transform: `rotate(${bmiToDegrees(bmiResult)}deg)`,
                  }}
                />
              </div>

              <div style={{ top: "5px", left: "310px", textAlign: "center" }}>
                {bmiResult !== 0 && (
                  <div>
                    <p style={{ fontSize: "150%" }}>Your BMI: {bmiResult}</p>
                    <p>Your status: {getBMIStatus(parseFloat(bmiResult))}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <h3>What is body mass index (BMI)?</h3>
      <br />
      <p>
        Body Mass Index (BMI) is widely used as an indicator of body fat
        content. Your weight alone is not sufficient to establish if you are in
        a healthy weight range. For example, a tall but slender person can weigh
        more than a short but plump individual. But the former may enjoy better
        health as long as their weight is suitable for their height. The ideal
        weight is also likely to differ for men and women of similar heights.
      </p>
      <br />
      <h3>What are the health risks related to being overweight?</h3>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "10px",
          marginRight: "",
        }}
      >
        <p style={{ width: "80%" }}>
          Excess weight brings with it countless health complications, some of
          which can be fatal.Generally, a person should try to maintain a BMI
          below 25 kg/m2, but ideally should consult their doctor to determine
          whether or not they need to make any changes to their lifestyle in
          order to be healthier. <br />A higher BMI than average (over 25) is
          associated with increased risks for diseases like:
        </p>

        <img src={obese} alt="" srcset="" style={{ marginLeft: "5%" }} />
      </div>
      <div classNameName="points" style={{ margin: "2%" }}>
        <div className="overWt-point-sec row slide-left delay02">
          <div className="li-sec1 col-md-5 col-xs-12 slide-left delay03">
            <ul
              className="no-btmpad"
              style={{ listStyle: "none", paddingLeft: "20px" }}
            >
              <li className="desc-text">Type 2 diabetes</li>
              <li className="desc-text">Heart conditions</li>
              
              <li className="desc-text">High triglycerides</li>
              <li className="desc-text">Stroke</li>
              <li className="desc-text">High blood pressure</li>
              <li className="desc-text">Gall bladder-related complications</li>
              <li className="desc-text">Insulin resistance </li>
              {/* </ul>                        
                        <div className="hide-slide js-overWt-slide">
                            <ul> */}
              <li className="desc-text">
                Osteoarthritis or breakdown of joint cartilage leading to
                painful joints
              </li>
              <li className="desc-text">
                Sleep apnea or intermittent breathing obstruction during sleep
              </li>
            </ul>
            {/* </div> */}
          </div>
          <div className="li-sec2 col-md-7 col-xs-12 hidden-xs hidden-sm slide-left delay03">
            <ul>
              <li className="desc-text">Breathing trouble </li>
              <li className="desc-text">Hernia</li>
              <li className="desc-text">Varicose veins</li>
              <li className="desc-text">Cataract</li>
              <li className="desc-text">Gout </li>
             
              <li className="desc-text">
                Certain types of cancer (breast, colon, endometrial, gall
                bladder, kidney, liver)
              </li>
              <li className="desc-text">
                Clinical depression and other mental health issues
              </li>
              <li className="desc-text">
                Poly-cystic ovarian disease in women leading to reduced
                fertility and other menstrual irregularities
              </li>
              <li className="desc-text">
                Atherosclerosis or building up of cholesterol deposits (plaques)
                in blood vessels (arteries)
              </li>
            
            </ul>
          </div>
        </div>
      </div>
      <br />
      <h3>What are the risks of being underweight?</h3>
      <br />
      <p>
        Having a BMI below 18 is also fraught with health risks, such as the
        ones listed below:
      </p>
      <br/>
      <div style={{display:"flex", alignItems:"center",marginLeft: "10%" }}>
        <img src={under} alt="" srcset=""  style={{ width: "20%", marginRight: "70px" }}/>
        <div
          class="underWt-point-sec slide-left delay03"
          style={{ margin: "2%" }}
        >
          <div>
            <ul class="no-btmpad">
              <li class="desc-text">Vitamin deficiencies</li>
              <li class="desc-text">
                Anaemia (low red blood cell count and hence reduced capacity to
                carry oxygen)
              </li>
              <li class="desc-text">
                Diminished immunity or the ability to ward off infections
              </li>
              <li class="desc-text">
                Osteoporosis or brittle bones that break easily
              </li>
              <li class="desc-text">Malnutrition </li>
              <li class="desc-text">Developmental delays in children</li>
              <li class="desc-text">Hormonal imbalances</li>
              <li class="desc-text">
                Disruptions in women's menstrual cycle causing complications in
                conception
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
