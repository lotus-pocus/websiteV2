import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import RetroExplosion from "./RetroExplosion";

const words = ["VR", "AR", "Games", "WebGL", "CGI"];

function FloatingWord({
  text,
  x,
  z,
  onHit,
}: {
  text: string;
  x: number;
  z: number;
  onHit: (text: string, pos: THREE.Vector3) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hit, setHit] = useState(false);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.z += 6 * delta; // move toward player
      if (ref.current.position.z > 5 && !hit) {
        onHit(text, ref.current.position.clone());
        setHit(true);
      }
    }
  });

  if (hit) return null;

  return (
    <group ref={ref} position={[x, 1.5, z]}>
      <Text
        fontSize={0.5}
        color="#00ffcc"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {text}
      </Text>
    </group>
  );
}

function Player() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0.3, 0]}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshBasicMaterial color={"#ff0055"} />
    </mesh>
  );
}

export default function RunnerScene() {
  const [explosions, setExplosions] = useState<
    { id: number; position: THREE.Vector3 }[]
  >([]);

  const handleHit = (text: string, pos: THREE.Vector3) => {
    setExplosions((prev) => [...prev, { id: Date.now(), position: pos }]);
  };

  const wordInstances = useMemo(
    () =>
      words.map((w, i) => (
        <FloatingWord
          key={i}
          text={w}
          x={Math.random() * 4 - 2}
          z={-20 - i * 5}
          onHit={handleHit}
        />
      )),
    []
  );

  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 60 }}
      style={{ height: "300px", width: "100%" }}
    >
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={1} />
      <Player />
      {wordInstances}
      {explosions.map((e) => (
        <RetroExplosion key={e.id} position={e.position} />
      ))}
      {/* Ground grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 40, 10, 10]} />
        <meshBasicMaterial color="#111" wireframe />
      </mesh>
    </Canvas>
  );
}
