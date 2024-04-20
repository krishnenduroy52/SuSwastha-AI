import React, { Suspense, useEffect, useRef, useState, useMemo } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  faUserDoctor,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import {
  faMicrophone,
  faTrash,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import { Canvas, useFrame } from "@react-three/fiber";
import Stylecss from "./Talk3d.module.css";
import {
  useGLTF,
  useTexture,
  Loader,
  Environment,
  useFBX,
  useAnimations,
  OrthographicCamera,
} from "@react-three/drei";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial";
import { LinearEncoding, sRGBEncoding } from "three/src/constants";
import { LineBasicMaterial, MeshPhysicalMaterial, Vector2 } from "three";
import ReactAudioPlayer from "react-audio-player";

import createAnimation from "./converter";
import blinkData from "./blendDataBlink.json";

import * as THREE from "three";
import axios from "axios";
import _ from "lodash";
import { chatAiRoute } from "../../Utils/APIRoutes";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const host = "http://localhost:5000";

function Avatar({
  avatar_url,
  speak,
  output,
  setSpeak,
  text,
  setAudioSource,
  playing,
}) {
  let gltf = useGLTF(avatar_url);
  let morphTargetDictionaryBody = null;
  let morphTargetDictionaryLowerTeeth = null;

  const [
    bodyTexture,
    eyesTexture,
    teethTexture,
    bodySpecularTexture,
    bodyRoughnessTexture,
    bodyNormalTexture,
    teethNormalTexture,
    // teethSpecularTexture,
    hairTexture,
    tshirtDiffuseTexture,
    tshirtNormalTexture,
    tshirtRoughnessTexture,
    hairAlphaTexture,
    hairNormalTexture,
    hairRoughnessTexture,
  ] = useTexture([
    "/images/body.webp",
    "/images/eyes.webp",
    "/images/teeth_diffuse.webp",
    "/images/body_specular.webp",
    "/images/body_roughness.webp",
    "/images/body_normal.webp",
    "/images/teeth_normal.webp",
    // "/images/teeth_specular.webp",
    "/images/h_color.webp",
    "/images/tshirt_diffuse.webp",
    "/images/tshirt_normal.webp",
    "/images/tshirt_roughness.webp",
    "/images/h_alpha.webp",
    "/images/h_normal.webp",
    "/images/h_roughness.webp",
  ]);

  _.each(
    [
      bodyTexture,
      eyesTexture,
      teethTexture,
      teethNormalTexture,
      bodySpecularTexture,
      bodyRoughnessTexture,
      bodyNormalTexture,
      tshirtDiffuseTexture,
      tshirtNormalTexture,
      tshirtRoughnessTexture,
      hairAlphaTexture,
      hairNormalTexture,
      hairRoughnessTexture,
    ],
    (t) => {
      t.encoding = sRGBEncoding;
      t.flipY = false;
    }
  );

  bodyNormalTexture.encoding = LinearEncoding;
  tshirtNormalTexture.encoding = LinearEncoding;
  teethNormalTexture.encoding = LinearEncoding;
  hairNormalTexture.encoding = LinearEncoding;

  gltf.scene.traverse((node) => {
    if (
      node.type === "Mesh" ||
      node.type === "LineSegments" ||
      node.type === "SkinnedMesh"
    ) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.frustumCulled = false;

      if (node.name.includes("Body")) {
        node.castShadow = true;
        node.receiveShadow = true;

        node.material = new MeshPhysicalMaterial();
        node.material.map = bodyTexture;
        // node.material.shininess = 60;
        node.material.roughness = 1.7;

        // node.material.specularMap = bodySpecularTexture;
        node.material.roughnessMap = bodyRoughnessTexture;
        node.material.normalMap = bodyNormalTexture;
        node.material.normalScale = new Vector2(0.6, 0.6);

        morphTargetDictionaryBody = node.morphTargetDictionary;

        node.material.envMapIntensity = 0.8;
        // node.material.visible = false;
      }

      if (node.name.includes("Eyes")) {
        node.material = new MeshStandardMaterial();
        node.material.map = eyesTexture;
        // node.material.shininess = 100;
        node.material.roughness = 0.1;
        node.material.envMapIntensity = 0.5;
      }

      if (node.name.includes("Brows")) {
        node.material = new LineBasicMaterial({ color: 0x000000 });
        node.material.linewidth = 1;
        node.material.opacity = 0.5;
        node.material.transparent = true;
        node.visible = false;
      }

      if (node.name.includes("Teeth")) {
        node.receiveShadow = true;
        node.castShadow = true;
        node.material = new MeshStandardMaterial();
        node.material.roughness = 0.1;
        node.material.map = teethTexture;
        node.material.normalMap = teethNormalTexture;

        node.material.envMapIntensity = 0.7;
      }

      if (node.name.includes("Hair")) {
        node.material = new MeshStandardMaterial();
        node.material.map = hairTexture;
        node.material.alphaMap = hairAlphaTexture;
        node.material.normalMap = hairNormalTexture;
        node.material.roughnessMap = hairRoughnessTexture;

        node.material.transparent = true;
        node.material.depthWrite = false;
        node.material.side = 2;
        node.material.color.setHex(0x000000);

        node.material.envMapIntensity = 0.3;
      }

      if (node.name.includes("TSHIRT")) {
        node.material = new MeshStandardMaterial();

        node.material.map = tshirtDiffuseTexture;
        node.material.roughnessMap = tshirtRoughnessTexture;
        node.material.normalMap = tshirtNormalTexture;
        node.material.color.setHex(0xffffff);

        node.material.envMapIntensity = 0.5;
      }

      if (node.name.includes("TeethLower")) {
        morphTargetDictionaryLowerTeeth = node.morphTargetDictionary;
      }
    }
  });

  const [clips, setClips] = useState([]);
  const mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), []);

  useEffect(() => {
    if (output === null) return;
    // outputSpeek("Hello i am krishnendu");

    makeSpeech(output)
      .then((response) => {
        console.log(response.data);
        let { blendData, filename } = response.data;

        let newClips = [
          createAnimation(blendData, morphTargetDictionaryBody, "HG_Body"),
          createAnimation(
            blendData,
            morphTargetDictionaryLowerTeeth,
            "HG_TeethLower"
          ),
        ];

        filename = host + filename;

        setClips(newClips);
        setAudioSource(filename);
      })
      .catch((err) => {
        console.error(err);
        setSpeak(false);
      });
  }, [output]);

  let idleFbx = useFBX("/idle.fbx");
  let { clips: idleClips } = useAnimations(idleFbx.animations);

  idleClips[0].tracks = _.filter(idleClips[0].tracks, (track) => {
    return (
      track.name.includes("Head") ||
      track.name.includes("Neck") ||
      track.name.includes("Spine2")
    );
  });

  idleClips[0].tracks = _.map(idleClips[0].tracks, (track) => {
    if (track.name.includes("Head")) {
      track.name = "head.quaternion";
    }

    if (track.name.includes("Neck")) {
      track.name = "neck.quaternion";
    }

    if (track.name.includes("Spine")) {
      track.name = "spine2.quaternion";
    }

    return track;
  });

  useEffect(() => {
    let idleClipAction = mixer.clipAction(idleClips[0]);
    idleClipAction.play();

    let blinkClip = createAnimation(
      blinkData,
      morphTargetDictionaryBody,
      "HG_Body"
    );
    let blinkAction = mixer.clipAction(blinkClip);
    blinkAction.play();
  }, []);

  // Play animation clips when available
  useEffect(() => {
    if (playing === false) return;

    _.each(clips, (clip) => {
      let clipAction = mixer.clipAction(clip);
      clipAction.setLoop(THREE.LoopOnce);
      clipAction.play();
    });
  }, [playing]);

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  return (
    <group name="avatar">
      <primitive object={gltf.scene} dispose={null} />
    </group>
  );
}

const makeSpeech = async (text) => {
  return await axios.post(host + "/talk", { text: "Loru lalit" });
};

const STYLES = {
  area: { position: "absolute", bottom: "10px", left: "10px", zIndex: 500 },
  text: {
    margin: "0px",
    width: "300px",
    padding: "5px",
    background: "none",
    color: "#ffffff",
    fontSize: "1.2em",
    border: "none",
  },
  speak: {
    padding: "10px",
    marginTop: "5px",
    display: "block",
    color: "#FFFFFF",
    background: "#222222",
    border: "None",
  },
  area2: { position: "absolute", top: "5px", right: "15px", zIndex: 500 },
  label: { color: "#777777", fontSize: "0.8em" },
};

function Talk3d() {
  const audioPlayer = useRef();

  const [speak, setSpeak] = useState(false);
  const [text, setText] = useState(
    "Hi i am SuSwasthaAI, Ask any question related to your health."
  );
  const [output, setOutput] = useState(null);
  const [audioSource, setAudioSource] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const outputSpeek = async (text) => {
    const initialPrompt =
      "Suppose you are a great doctor and have most of medical knowledge and you can tell cure to people. Your name is Sophia. You can help them by your own. Your profession is of a doctor, you can't do any other things accept that. Don't let anyone know that you are an AI model. Wrap your answer in between 30 words, give the response without any emotion, recommend medicine or proper guidance.";

    try {
      // setLoading(true);
      // const response = await axios.post(chatAiRoute, {
      //   prompt: initialPrompt + text,
      // });
      const response = {
        data: {
          choices: [
            {
              message: {
                content: "Hello",
              },
            },
          ],
        },
      };
      const outputText = response.data.choices[0].message.content;
      setOutput(outputText);
      setSpeak(true);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  // End of play
  function playerEnded(e) {
    setAudioSource(null);
    setSpeak(false);
    setPlaying(false);
  }

  // Player is read
  function playerReady(e) {
    console.log("ready");
    audioPlayer.current.audioEl.current.play();
    setPlaying(true);
  }

  // for speech recognition
  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    console.log("Unsupported Browser!");
  }

  useEffect(() => {
    if (listening) setText(transcript);
  });

  return (
    <div className={`full ${Stylecss.full}`}>
      <div className={Stylecss.area}>
        <div className={Stylecss.team}>
          <textarea
            rows={4}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.substring(0, 200))}
          />
          <button onClick={resetTranscript} className={Stylecss.sp}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <button onClick={() => outputSpeek(text)} className={Stylecss.btn}>
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            <p>{speak ? "Running..." : "Genrate"}</p>
          </button>

          <button
            onClick={
              listening ? SpeechRecognition.stopListening : startListening
            }
            className={Stylecss.btn}
          >
            {!listening ? (
              <FontAwesomeIcon icon={faMicrophone} />
            ) : (
              <FontAwesomeIcon icon={faPause} />
            )}
            <p>{listening ? "Pause" : "Start"}</p>
          </button>

          <Link to="/appointment">
            <button className={Stylecss.btn}>
              <FontAwesomeIcon icon={faUserDoctor} />
              <p>Appointment</p>
            </button>
          </Link>
        </div>
      </div>

      <ReactAudioPlayer
        src={audioSource}
        ref={audioPlayer}
        onEnded={playerEnded}
        onCanPlayThrough={playerReady}
      />

      {/* <Stats /> */}
      <Canvas
        dpr={2}
        onCreated={(ctx) => {
          ctx.gl.physicallyCorrectLights = true;
        }}
        className={Stylecss.canvas}
      >
        <OrthographicCamera
          makeDefault
          zoom={2000}
          position={[-0.1, 1.66, 1]}
          className={Stylecss.char}
        />

        {/* <OrbitControls
        target={[0, 1.65, 0]}
      /> */}

        <Suspense fallback={null}>
          <Environment
            background={false}
            files="/images/photo_studio_loft_hall_1k.hdr"
          />
        </Suspense>

        <Suspense fallback={null}>
          <Avatar
            avatar_url="/model.glb"
            speak={speak}
            output={output}
            setSpeak={setSpeak}
            text={text}
            setAudioSource={setAudioSource}
            playing={playing}
          />
        </Suspense>
      </Canvas>
      <Loader dataInterpolation={(p) => `Loading... please wait`} />
    </div>
  );
}

export default Talk3d;
