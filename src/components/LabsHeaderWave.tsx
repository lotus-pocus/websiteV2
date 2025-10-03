// src/components/LabsHeaderWave.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LabsHeaderWave = () => {
  const [mouse, setMouse] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  useEffect(() => {
    const handleMove = (e: MouseEvent) =>
      setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const width = window.innerWidth;

  // Control point X follows cursor X
  const cpX = mouse.x;

  // Normalize vertical position (0 top → 1 bottom)
  const yNorm = mouse.y / window.innerHeight;

  // Control point Y (depth of wave) exaggerated
  const cpY = 200 + 80 + yNorm * 120;
  // base 200 (instead of 320), plus extra dip

  // SVG path (single wave)
  const d = `
    M0,0 
    L0,200 
    Q${cpX},${cpY} ${width},200 
    L${width},0 
    Z
  `;

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 left-0 w-full h-full"
      preserveAspectRatio="none"
    >
      <motion.path
        d={d}
        fill="#ff3399"
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 20,
          mass: 0.7,
        }}
      />
    </motion.svg>
  );
};

export default LabsHeaderWave;
