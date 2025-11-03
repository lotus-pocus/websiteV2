// src/components/Layout.tsx
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomCursor from "./CustomCursor";
import MobileMenu from "./MobileMenu"; // 👈 import
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

const Layout = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  // Detect dark sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const topEntry = entries.find((entry) => entry.isIntersecting);
        if (topEntry) {
          const theme = topEntry.target.getAttribute("data-theme");
          setIsDark(theme === "dark");
        }
      },
      { threshold: 0.6 }
    );
    const sections = document.querySelectorAll("section[data-theme]");
    sections.forEach((section) => observer.observe(section));
    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="relative isolation-isolate z-0">
      <CustomCursor position={cursor} />

      {/* 👇 Add mobile menu with dynamic color */}
      <MobileMenu isDark={isDark} />

      <main className="p-0 m-0">{children}</main>

      {/* footer ... */}
    </div>
  );
};

export default Layout;
