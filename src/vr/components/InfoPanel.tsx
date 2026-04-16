import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface InfoPanelProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  title: string;
  subtitle?: string;
  body?: string;
  width?: number;
  color?: string;
  bgColor?: string;
}

export function InfoPanel({
  position,
  rotation = [0, 0, 0],
  title,
  subtitle,
  body,
  width = 1.2,
  color = '#ffffff',
  bgColor = '#1a1a2e',
}: InfoPanelProps) {
  const height = useMemo(() => {
    let h = 0.3; // title
    if (subtitle) h += 0.2;
    if (body) h += Math.ceil(body.length / 40) * 0.15 + 0.1;
    return Math.max(h, 0.4);
  }, [subtitle, body]);

  return (
    <group position={position} rotation={rotation}>
      {/* Background panel */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color={bgColor}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Border */}
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[width + 0.02, height + 0.02]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Title */}
      <Text
        position={[0, height / 2 - 0.15, 0.01]}
        fontSize={0.1}
        color={color}
        anchorX="center"
        anchorY="middle"
        maxWidth={width - 0.1}
      >
        {title}
      </Text>

      {/* Subtitle */}
      {subtitle && (
        <Text
          position={[0, height / 2 - 0.32, 0.01]}
          fontSize={0.07}
          color="#aaa"
          anchorX="center"
          anchorY="middle"
          maxWidth={width - 0.1}
          fontStyle="italic"
        >
          {subtitle}
        </Text>
      )}

      {/* Body text */}
      {body && (
        <Text
          position={[0, subtitle ? height / 2 - 0.5 : height / 2 - 0.35, 0.01]}
          fontSize={0.06}
          color="#ccc"
          anchorX="center"
          anchorY="top"
          maxWidth={width - 0.15}
          lineHeight={1.4}
        >
          {body}
        </Text>
      )}
    </group>
  );
}
