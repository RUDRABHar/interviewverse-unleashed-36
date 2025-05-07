
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Html } from '@react-three/drei';
import { SkillNode } from './SkillNode';

interface SkillGalaxyViewProps {
  skills: any[];
  viewMode: 'galaxy' | 'neural';
  onSkillClick: (skill: any) => void;
  lowPerformanceMode: boolean;
}

// Center node for galaxy view
const CenterNode = () => {
  return (
    <mesh>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color="#172554" transparent opacity={0.3} />
    </mesh>
  );
};

// Particle background effect
const ParticleField = ({ count = 2000 }) => {
  const particles = useRef<THREE.Points>(null);
  
  useFrame(() => {
    if (particles.current) {
      particles.current.rotation.y += 0.0001;
    }
  });
  
  const particlePositions = React.useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 100 + 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, [count]);

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlePositions.length / 3}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#aeb9e1" sizeAttenuation transparent opacity={0.6} />
    </points>
  );
};

// Neural connections for neural view
const NeuralConnections = ({ skills }: { skills: any[] }) => {
  const lines = [];
  const centerNode = [0, 0, 0];

  // Connect each skill to center
  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    lines.push(
      <line key={`line-center-${i}`}>
        <bufferGeometry
          attach="geometry"
          setFromPoints={[
            { x: centerNode[0], y: centerNode[1], z: centerNode[2] },
            { x: skill.position[0], y: skill.position[1], z: skill.position[2] }
          ]}
        />
        <lineBasicMaterial attach="material" color="#465470" transparent opacity={0.3} />
      </line>
    );

    // Connect to nearest neighbors
    for (let j = i + 1; j < skills.length; j++) {
      const otherSkill = skills[j];
      // Only connect if in same category or close by
      if (skill.category === otherSkill.category || Math.random() < 0.2) {
        lines.push(
          <line key={`line-${i}-${j}`}>
            <bufferGeometry
              attach="geometry"
              setFromPoints={[
                { x: skill.position[0], y: skill.position[1], z: skill.position[2] },
                { x: otherSkill.position[0], y: otherSkill.position[1], z: otherSkill.position[2] }
              ]}
            />
            <lineBasicMaterial attach="material" color="#465470" transparent opacity={0.1} />
          </line>
        );
      }
    }
  }

  return <>{lines}</>;
};

export const SkillGalaxyView: React.FC<SkillGalaxyViewProps> = ({ 
  skills, 
  viewMode, 
  onSkillClick, 
  lowPerformanceMode 
}) => {
  const particleCount = lowPerformanceMode ? 500 : 2000;
  
  // Auto-rotate the scene slightly
  const sceneRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (sceneRef.current && !lowPerformanceMode) {
      sceneRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <Canvas
      camera={{ position: [0, 15, 30], fov: 60 }}
      className="bg-black"
      gl={{ antialias: !lowPerformanceMode }}
      dpr={lowPerformanceMode ? 1 : [1, 2]}
    >
      <color attach="background" args={[viewMode === 'galaxy' ? '#000819' : '#050816']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Main scene */}
      <group ref={sceneRef}>
        {/* Center node - galaxy core or brain center */}
        {viewMode === 'galaxy' && <CenterNode />}

        {/* Skills nodes */}
        {skills.map((skill) => (
          <SkillNode
            key={skill.id}
            skill={skill}
            viewMode={viewMode}
            onClick={() => onSkillClick(skill)}
          />
        ))}

        {/* Neural connections for neural view */}
        {viewMode === 'neural' && <NeuralConnections skills={skills} />}
      </group>

      {/* Background effects */}
      {viewMode === 'galaxy' && !lowPerformanceMode && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
      {!lowPerformanceMode && <ParticleField count={particleCount} />}
      
      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={false}
        autoRotateSpeed={0.5}
        zoomSpeed={0.6}
        panSpeed={0.5}
        rotateSpeed={0.5}
        dampingFactor={0.1}
        minDistance={5}
        maxDistance={100}
      />
    </Canvas>
  );
};
