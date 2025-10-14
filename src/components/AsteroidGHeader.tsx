// src/components/AsteroidGHeader.tsx
export default function AsteroidGHeader() {
  return (
    <div
      className="absolute top-0 left-0 w-full z-50 bg-black/90 flex items-center justify-between px-8"
      style={{ height: "80px" }}
    >
      {/* Rotating wireframe G */}
      <div
        className="w-20 h-20 flex items-center justify-center"
        // style={{ perspective: "600px" }}
      >
        <svg
          viewBox="0 0 120 120"
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 drop-shadow-[0_0_6px_#ff00aa]"
          style={{
            animation: "spin3D 8s linear infinite",
            transformOrigin: "center center",
          }}
        >
          <g
            stroke="#ff00aa"
            strokeWidth="4"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            {/* Outer G shape (square/tech outline) */}
            <path d="M95 20 H40 C30 20 20 30 20 40 V80 C20 90 30 100 40 100 H80 C90 100 100 90 100 80 V65 H65" />
            {/* Inner reinforcement lines */}
            <line x1="40" y1="35" x2="85" y2="35" />
            <line x1="40" y1="85" x2="85" y2="85" />
            <line x1="40" y1="35" x2="40" y2="85" />
          </g>
        </svg>
      </div>

      <div className="text-white text-sm opacity-60 pr-4 select-none">
        
      </div>

      <style>
        {`
          @keyframes spin3D {
            0%   { transform: rotateY(0deg) rotateZ(0deg); }
            50%  { transform: rotateY(180deg) rotateZ(5deg); }
            100% { transform: rotateY(360deg) rotateZ(0deg); }
          }
        `}
      </style>
    </div>
  );
}
