import React from "react";

interface SectionDividerProps {
  color?: string;
  thickness?: string;
  angle?: number;
}

const SectionDivider: React.FC<SectionDividerProps> = ({
  color = "#ffffff",
  thickness = "8px",
  angle = 3.5,
}) => {
  return (
    <div
      className="relative w-full"
      style={{
        height: 0,
        lineHeight: 0,
        isolation: "auto",          // ✅ prevents blend isolation
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "-5%",
          width: "110%",
          height: thickness,
          background: color,
          transform: `rotate(-${angle}deg)`,
          transformOrigin: "center",
          zIndex: 0,                 // ✅ sits below cursor layer
          mixBlendMode: "normal",    // ✅ doesn’t block blending
        }}
      />
    </div>
  );
};

export default SectionDivider;
