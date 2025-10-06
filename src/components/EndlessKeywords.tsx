// src/components/EndlessKeywords.tsx
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const keywords = ["VR", "AR", "Games", "Animation", "WebGL", "CGI", "Immersive"];

export default function EndlessKeywords() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: ["0%", "-100%"],
      transition: {
        repeat: Infinity,
        duration: 20,
        ease: "linear",
      },
    });
  }, [controls]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {[0, 1].map((layer) => (
        <motion.div
          key={layer}
          animate={controls}
          className="flex gap-16 whitespace-nowrap text-6xl font-fun uppercase"
          style={{
            top: `${layer * 50}%`,
            position: "absolute",
            color: layer % 2 ? "#ff0055" : "#00ffcc",
          }}
        >
          {keywords.map((word, i) => (
            <span key={i}>{word}</span>
          ))}
          {/* repeat twice for seamless loop */}
          {keywords.map((word, i) => (
            <span key={`copy-${i}`}>{word}</span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
