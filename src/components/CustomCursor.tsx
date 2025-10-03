import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type CursorProps = {
  position: { x: number; y: number };
};

const CustomCursor = ({ position }: CursorProps) => {
  const [cursorType, setCursorType] = useState<"default" | "hover" | "burger">("default");

  useEffect(() => {
    const checkHover = () => {
      const hoveredElement = document.elementFromPoint(position.x, position.y);
      if (!hoveredElement) return;

      if (hoveredElement.closest("[data-cursor='burger']")) {
        setCursorType("burger");
      } else if (
        hoveredElement.closest("a, button, .cursor-hover, [data-cursor='hover']")
      ) {
        setCursorType("hover");
      } else {
        setCursorType("default");
      }
    };

    checkHover(); // run once
    const interval = setInterval(checkHover, 50); 
    return () => clearInterval(interval);
  }, [position]);

  // Sizes for different states
  const size = cursorType === "hover" || cursorType === "burger" ? 200 : 32;
  const offset = size / 2;

  // Colors
  const bgColor =
    cursorType === "burger"
      ? "#ff00aa" // 👈 bright pink for contrast on burger
      : "white";

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[10000]"
      style={{
        mixBlendMode: "difference", // keep consistent
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
        type: "spring",
        stiffness: 300,
        damping: 24,
      }}
    />
  );
};

export default CustomCursor;
