import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomCursor from "./CustomCursor";
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

/* ---------- Scroll to top on route change ---------- */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

/* ---------- Layout Wrapper ---------- */
const Layout = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  // 👇 Detect section theme (light/dark)
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

  // 👇 Track mouse position for custom cursor
  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="relative isolation-isolate z-0">
      {/* Global scroll-to-top on route change */}
      <ScrollToTop />

      <CustomCursor position={cursor} />

      <main className="p-0 m-0">{children}</main>

      {/* 👇 Footer with socials */}
      <footer
        className="
          relative 
          z-[1000] 
          will-change-transform 
          transform-gpu 
          px-6 py-8 
          text-center text-sm text-neutral-400 
          bg-transparent
        "
        style={{
          transform: "translateZ(0)", // ensures its own compositing layer
        }}
      >
        <div className="flex justify-center gap-4 mb-3">
          <a
            href="https://www.instagram.com/gamoola3d"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 hover:text-pink-500 transition-colors filter-none" />
          </a>
          <a
            href="https://www.facebook.com/gamoola"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5 hover:text-blue-600 transition-colors filter-none" />
          </a>
          <a
            href="https://www.linkedin.com/company/gamoola"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5 hover:text-blue-700 transition-colors filter-none" />
          </a>
          <a
            href="https://twitter.com/Gamoola3d"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5 hover:text-sky-500 transition-colors filter-none" />
          </a>
        </div>

        © {new Date().getFullYear()} gamoola. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
