/* eslint-disable react/no-unknown-property */
import {Suspense, useEffect, useState} from 'react'
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Preload, useGLTF } from "@react-three/drei"

import CanvasLoader from "../Loader"

const Computers = ( {isMobile}) => {
  const computer = useGLTF('/desktop_pc/scene.gltf')
  return (
    <mesh>
      <hemisphereLight intensity={2.9} groundColor="black" />
      <pointLight intensity={2} />
      <spotLight position={[-20, 50, 10]} angle={0.12} penubra={1} intensity={1} castShadow shadow-mapSize={1024}/>
      <primitive scale={isMobile ? 0.7 : 0.75} position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]} rotation={[-0.01, -0.2, -0.1]} object={computer.scene}/>
    </mesh>
  )
}

const ComputerCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // add event listener if the screen size is changed 
    const mediaQuery = window.matchMedia('(max-width: 500px)')
    // set the initial value of isMobile state variable 
    setIsMobile(mediaQuery.matches)
    // define a callback function to handle changes to the media query 
    const handleMediaQueryChange = (e) => {
      setIsMobile(e.matches)
      // add the callback function as a listener for changes to the media query
      mediaQuery.addEventListener('change', handleMediaQueryChange)
      // remove the event listener when the component is unmounted 
      return () => {
        mediaQuery.removeEventListener('change', handleMediaQueryChange)
      }
    }
  }, [])
  return (
    <Canvas frameloop="demand" shadows camera={{ position: [20, 3, 5], fov: 25 }} gl={{preserveDrawingBuffer: true}}>
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} enableZoom={false}/>
        <Computers isMobile={isMobile}/>
      </Suspense>
      <Preload all />
    </Canvas>
  )
}
export default ComputerCanvas