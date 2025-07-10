import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

type MobileMenuProps = {
  isDark: boolean;
};

const MobileMenu = ({ isDark }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Burger OR Close button (only one shown at a time) */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-6 right-6 z-[99999] p-2"
          aria-label="Open menu"
          data-cursor="burger"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`w-8 h-8 ${isDark ? "text-white" : "text-black"}`}
          >
            <path d="M3 6h18v2H3z" />
            <path d="M3 11h18v2H3z" />
            <path d="M3 16h18v2H3z" />
          </svg>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed top-6 right-6 z-[99999] p-2 text-4xl text-white"
          aria-label="Close menu"
        >
          ✕
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center gap-8 text-3xl">
          {/* External link */}
          <a
            href="https://www.gamoola.com/gamoola/desktop/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
          >
            Interactive
          </a>

          {/* Internal routes */}
          <Link to="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/work" onClick={() => setIsOpen(false)}>
            Work
          </Link>
          <Link to="/labs" onClick={() => setIsOpen(false)}>
            Labs
          </Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
