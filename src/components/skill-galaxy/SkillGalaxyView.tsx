
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { SkillNode } from './SkillNode';
import * as THREE from 'three';

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
  
  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 100)}
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
    const points = [
      new THREE.Vector3(centerNode[0], centerNode[1], centerNode[2]),
      new THREE.Vector3(skill.position[0], skill.position[1], skill.position[2])
    ];
    
    lines.push(
      <line key={`line-center-${i}`}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#465470" transparent opacity={0.3} />
      </line>
    );

    // Connect to nearest neighbors
    for (let j = i + 1; j < skills.length; j++) {
      const otherSkill = skills[j];
      // Only connect if in same category or close by
      if (skill.category === otherSkill.category || Math.random() < 0.2) {
        const neighborPoints = [
          new THREE.Vector3(skill.position[0], skill.position[1], skill.position[2]),
          new THREE.Vector3(otherSkill.position[0], otherSkill.position[1], otherSkill.position[2])
        ];
        
        lines.push(
          <line key={`line-${i}-${j}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={neighborPoints.length}
                array={new Float32Array(neighborPoints.flatMap(p => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#465470" transparent opacity={0.1} />
          </line>
        );
      }
    }
  }

  return <>{lines}</>;
};

// Scene component that will contain all 3D objects
const Scene = ({ 
  skills, 
  viewMode, 
  onSkillClick, 
  lowPerformanceMode 
}: SkillGalaxyViewProps) => {
  const sceneRef = useRef<THREE.Group>(null);

  return (
    <group ref={sceneRef}>
      <color attach="background" args={[viewMode === 'galaxy' ? '#000819' : '#050816']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />

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

      {/* Background effects */}
      {viewMode === 'galaxy' && !lowPerformanceMode && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
      {!lowPerformanceMode && <ParticleField count={lowPerformanceMode ? 500 : 2000} />}
      
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
    </group>
  );
};

export const SkillGalaxyView: React.FC<SkillGalaxyViewProps> = (props) => {
  return (
    <Canvas
      camera={{ position: [0, 15, 30], fov: 60 }}
      className="bg-black"
      gl={{ antialias: !props.lowPerformanceMode }}
      dpr={props.lowPerformanceMode ? 1 : [1, 2]}
    >
      <Scene {...props} />
    </Canvas>
  );
};
