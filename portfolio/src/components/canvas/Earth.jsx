import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";
import { useTheme } from "../../context/ThemeContext";

const Earth = () => {
  const earth = useGLTF("./planet/scene.gltf");

  return (
    <primitive object={earth.scene} scale={2.1} position-y={0} rotation-y={0} />
  );
};

const EarthCanvas = () => {
  const { darkMode } = useTheme();

  return (
    <div className="earth-container w-full h-full">
      <Canvas
        shadows
        frameloop="demand"
        gl={{ preserveDrawingBuffer: true }}
        camera={{ fov: 45, near: 0.1, far: 200, position: [-4, 3, 10] }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            autoRotate
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
            rotateSpeed={0.5}
          />
          <Earth />
          <Preload all />
        </Suspense>
        {darkMode && <ambientLight intensity={0.5} />}
        {!darkMode && (
          <>
            <ambientLight intensity={1.0} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
          </>
        )}
      </Canvas>
    </div>
  );
};

export default EarthCanvas;
