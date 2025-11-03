// src/components/CustomCursor.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { createPortal } from "react-dom";

type CursorProps = {
  position: { x: number; y: number };
};

const BLEND_LAYER_ID = "cursor-blend-layer";

function ensureBlendLayer(): HTMLElement {
  let layer = document.getElementById(BLEND_LAYER_ID) as HTMLElement | null;
  if (!layer) {
    layer = document.createElement("div");
    layer.id = BLEND_LAYER_ID;
    Object.assign(layer.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      mixBlendMode: "difference",   // 👈 blend the whole layer
      zIndex: "2147483646",
      transform: "translateZ(0)",
      // defensive: avoid accidental stacking traps
      isolation: "auto",
      background: "transparent",
    });
    document.body.appendChild(layer);
  }
  return layer;
}

const CustomCursor = ({ position }: CursorProps) => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [lastPos, setLastPos] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  // Reset to center on route change
  useEffect(() => {
    setLastPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }, [location]);

  // Track mouse position
  useEffect(() => {
    if (position.x > 0 && position.y > 0) setLastPos(position);
  }, [position]);

  useEffect(() => setMounted(true), []);

  const size = 32; // adjust if you want
  const offset = size / 2;

  // The circle is plain white; the parent layer handles blending.
  const cursor = (
    <motion.div
      className="pointer-events-none fixed top-0 left-0"
      style={{
        // no mixBlendMode here on the circle itself
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#ffffff",
        transform: "translateZ(0)",
      }}
      animate={{
        x: lastPos.x - offset,
        y: lastPos.y - offset,
        opacity: 1,
      }}
      transition={{ duration: 0 }}
    />
  );

  if (!mounted) return null;

  const layer = ensureBlendLayer();
  return createPortal(cursor, layer);
};

export default CustomCursor;
