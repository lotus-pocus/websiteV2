// src/components/CustomCursor.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type CursorProps = {
  position: { x: number; y: number };
};

const CustomCursor = ({ position }: CursorProps) => {
  const [cursorType, setCursorType] = useState<"default" | "hover" | "burger">("default");
  const [cursorColor, setCursorColor] = useState("#ffffff");

  useEffect(() => {
    const fetchColor = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const res = await fetch(`${base}/items/site_settings?fields=cursor_color`);
        const data = await res.json();
        const color = data?.data?.[0]?.cursor_color;
        if (color) setCursorColor(color);
      } catch (err) {
        console.error("Failed to fetch cursor color:", err);
      }
    };
    fetchColor();
  }, []);

  // Check hover type
  useEffect(() => {
    const checkHover = () => {
      const hoveredElement = document.elementFromPoint(position.x, position.y);
      if (!hoveredElement) return;
      if (hoveredElement.closest("[data-cursor='burger']")) {
        setCursorType("burger");
      } else if (hoveredElement.closest("a, button, .cursor-hover, [data-cursor='hover']")) {
        setCursorType("hover");
      } else {
        setCursorType("default");
      }
    };
    checkHover();
    const interval = setInterval(checkHover, 50);
    return () => clearInterval(interval);
  }, [position]);

  const size = 32;
  const offset = size / 2;
  const bgColor = cursorType === "burger" ? "#ff00aa" : cursorColor;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[10000]"
      style={{
        mixBlendMode: "difference",
        borderRadius: "9999px",
        backgroundColor: bgColor,
      }}
      animate={{
        width: size,
        height: size,
        x: position.x - offset,
        y: position.y - offset,
        opacity: 1,
      }}
      transition={{
        duration: 0, // 👈 instant follow — no lag
      }}
    />
  );
};

export default CustomCursor;
