'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface WheelModelProps {
  width: number;
  profile: number;
  diameter: number;
  offset: number;
}

function WheelModel({ width, profile, diameter, offset }: WheelModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/assets/models/wheel.glb');

  // Dynamic scaling based on selected configuration state
  // Standardize around base values: width 245, profile 40, diameter 19
  const baseWidth = 245;
  const baseProfile = 40;
  const baseDiameter = 19;

  const scaleX = width / baseWidth;
  const scaleY = (diameter + (width * (profile / 100)) / 25.4 / 2) / (baseDiameter + (baseWidth * (baseProfile / 100)) / 25.4 / 2);
  const scaleZ = scaleY;

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle auto-rotation or idle breathing if desired, keeping it smooth
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive 
          object={scene} 
          scale={[scaleX * 1.5, scaleY * 1.5, scaleZ * 1.5]} 
          position={[0, 0, 0]} 
        />
      </Center>
    </group>
  );
}

interface WheelViewer3DProps {
  width: number;
  profile: number;
  diameter: number;
  offset: number;
}

export default function WheelViewer3D({ width, profile, diameter, offset }: WheelViewer3DProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 20, 15]} intensity={1.5} />
        <directionalLight position={[-10, -10, -15]} intensity={0.5} />
        
        <WheelModel width={width} profile={profile} diameter={diameter} offset={offset} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
          autoRotate={false}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
