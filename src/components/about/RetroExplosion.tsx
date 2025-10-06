import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function RetroExplosion({ position }: { position: THREE.Vector3 }) {
  const ref = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 60;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 0.5;
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.y += delta;
      const mat = ref.current.material as THREE.PointsMaterial;
      mat.opacity -= delta * 0.6;
      if (mat.opacity <= 0) ref.current.visible = false;
    }
  });

  return (
    <points ref={ref} position={position}>
      <bufferGeometry attach="geometry" {...particles} />
      <pointsMaterial color="#ff00ff" size={0.05} transparent opacity={1} />
    </points>
  );
}
