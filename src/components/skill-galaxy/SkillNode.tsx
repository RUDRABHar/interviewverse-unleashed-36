
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Color, MeshStandardMaterial } from 'three';

interface SkillNodeProps {
  skill: {
    id: string;
    name: string;
    position: [number, number, number];
    color: string;
    score: number;
    size: number;
    orbit: number;
  };
  viewMode: 'galaxy' | 'neural';
  onClick: () => void;
}

export const SkillNode: React.FC<SkillNodeProps> = ({ skill, viewMode, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const originalPosition = useRef<[number, number, number]>([...skill.position]);
  
  // Dynamic glow intensity based on skill score
  const glowIntensity = skill.score / 50; // 0-2 range
  
  // Dynamic scale based on skill importance and hover state
  const scale = skill.size * (hovered ? 1.3 : 1);
  
  // Orbital movement for galaxy view
  useFrame(({ clock }) => {
    if (meshRef.current && viewMode === 'galaxy') {
      const t = clock.getElapsedTime() * 0.05;
      const speed = 0.2 / skill.orbit; // Outer orbits move slower
      
      meshRef.current.position.x = originalPosition.current[0] * Math.cos(t * speed) - originalPosition.current[2] * Math.sin(t * speed);
      meshRef.current.position.z = originalPosition.current[0] * Math.sin(t * speed) + originalPosition.current[2] * Math.cos(t * speed);
      
      // Subtle vertical oscillation
      meshRef.current.position.y = originalPosition.current[1] + Math.sin(t * 0.5) * 0.2;
    }
  });
  
  // Create custom material with glow effect
  const nodeMaterial = React.useMemo(() => {
    const material = new MeshStandardMaterial({
      color: new Color(skill.color),
      emissive: new Color(skill.color),
      emissiveIntensity: glowIntensity,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: 0.9,
    });
    return material;
  }, [skill.color, glowIntensity]);
  
  return (
    <group>
      <mesh
        ref={meshRef}
        position={skill.position}
        scale={[scale, scale, scale]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <primitive object={nodeMaterial} />
      </mesh>
      
      {/* Tooltip */}
      {hovered && (
        <Html position={[skill.position[0], skill.position[1] + 2, skill.position[2]]} center>
          <div className="bg-gray-900/80 backdrop-blur-sm px-3 py-2 rounded-lg text-white text-sm whitespace-nowrap pointer-events-none">
            <p className="font-bold">{skill.name}</p>
            <p className="text-center text-teal-300">{Math.round(skill.score)}% mastery</p>
          </div>
        </Html>
      )}
      
      {/* Optional glow sphere for stronger visual effect */}
      {skill.score > 50 && (
        <mesh position={skill.position} scale={[scale * 1.2, scale * 1.2, scale * 1.2]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color={skill.color}
            transparent={true}
            opacity={0.15}
          />
        </mesh>
      )}
    </group>
  );
};
