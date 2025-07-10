import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type CursorProps = {
  position: { x: number; y: number };
};

const CustomCursor = ({ position }: CursorProps) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkHover = () => {
      const hoveredElement = document.elementFromPoint(position.x, position.y);
      if (!hoveredElement) return;

      const matches =
        hoveredElement.closest(
          "a, button, .cursor-hover, [data-cursor='hover'], [data-cursor='burger']"
        ) !== null;

      setIsHovered(matches);
    };

    checkHover(); // Run once on mount
    const interval = setInterval(checkHover, 50); // Poll every 50ms

    return () => clearInterval(interval);
  }, [position]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[10000]"
      style={{
        mixBlendMode: "difference",
        borderRadius: "9999px",
        backgroundColor: "white",
      }}
      animate={{
        width: isHovered ? 200 : 32,
        height: isHovered ? 200 : 32,
        x: position.x - (isHovered ? 100 : 16),
        y: position.y - (isHovered ? 100 : 16),

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
