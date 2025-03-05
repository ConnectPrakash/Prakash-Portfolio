import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { Text } from "@react-three/drei";

const sentence = "A";
const letterPaths = {
  A: [
    new THREE.Vector3(-0.2, -0.3, 0), // Start left stroke
    new THREE.Vector3(0, 0.3, 0), // Move to top
    new THREE.Vector3(0.2, -0.3, 0), // Move down right
    new THREE.Vector3(-0.1, 0, 0), // Move to middle bar start
    new THREE.Vector3(0.1, 0, 0), // Move to middle bar end
  ],
};

const Pen = ({ progress }) => {
  const penRef = useRef();
  const gltf = useLoader(GLTFLoader, "/models/scene.gltf");

  useFrame(() => {
    if (penRef.current) {
      const currentLetter = sentence[0];
      const path = letterPaths[currentLetter];

      if (path) {
        const index = Math.floor(progress * path.length);
        const point = path[index];

        if (point) {
          penRef.current.position.set(point.x, point.y, point.z);
        }
      }
    }
  });

  return <primitive object={gltf.scene} ref={penRef} scale={[0.2, 0.2, 0.2]} />;
};

const WritingText = ({ progress }) => {
  return (
    <Text position={[-0.5, 0, 0]} fontSize={0.5} color="black">
      {sentence.slice(0, Math.floor(progress * sentence.length))}
    </Text>
  );
};

const Page = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.05;
        if (next >= 1) {
          clearInterval(interval);
          return 1;
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} />
      <WritingText progress={progress} />
      <Pen progress={progress} />
    </Canvas>
  );
};

export default Page;
