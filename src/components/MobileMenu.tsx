import { useState } from "react";
import { Link } from "react-router-dom";

type MobileMenuProps = {
  isDark: boolean;
};

const MobileMenu = ({ isDark }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ─── BURGER BUTTON ─────────────────────────────── */}
      {!isOpen ? (
        <div
          className="fixed top-6 right-6 z-[99999]"
          style={{
            mixBlendMode: "normal", // ✅ isolate from background effects
            isolation: "isolate",
            pointerEvents: "auto",
          }}
        >
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            data-cursor="burger"
            className="p-2"
          >
            {/* Solid burger icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-8 h-8 transition-colors duration-300"
              fill={isDark ? "#ffffff" : "#000000"} // ✅ solid fill
              stroke="none" // ✅ remove outline
              style={{
                display: "block",
                mixBlendMode: "normal",
                filter: "none",
              }}
            >
              <rect x="3" y="5" width="18" height="2" rx="1" />
              <rect x="3" y="11" width="18" height="2" rx="1" />
              <rect x="3" y="17" width="18" height="2" rx="1" />
            </svg>
          </button>
        </div>
      ) : (
        /* ─── CLOSE BUTTON ─────────────────────────────── */
        <div
          className="fixed top-6 right-6 z-[99999]"
          style={{
            mixBlendMode: "normal", // ✅ prevent cursor blending
            isolation: "isolate",
            pointerEvents: "auto",
          }}
        >
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="p-2 text-4xl font-bold transition-colors duration-300"
            style={{
              color: isDark ? "#ffffff" : "#000000",
              mixBlendMode: "normal",
              filter: "none",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── OVERLAY ───────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8 text-3xl"
          style={{
            backgroundColor: "black", // solid black background
            color: "white",
            mixBlendMode: "normal", // ✅ isolate from global effects
            isolation: "isolate",
          }}
        >
          {["Interactive", "Home", "Work", "Labs", "About", "Contact"].map(
            (label) => (
              <Link
                key={label}
                to={label === "Home" ? "/" : `/${label.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="hover:text-pink-400 transition-colors"
              >
                {label}
              </Link>
            )
          )}
        </div>
      )}
    </>
  );
};

export default MobileMenu;
