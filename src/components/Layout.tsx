import { ReactNode, useEffect, useState } from "react";
import CustomCursor from "./CustomCursor";
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

const Layout = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Intersection observer for theme toggling
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
    };
  }, []);

  useEffect(() => {
    // Mouse position tracking
    const move = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    // 👇 Persistent watch for inputs in the DOM
    const logInputs = () => {
      const inputs = document.querySelectorAll("input");
      console.log(`[DEBUG] Found ${inputs.length} input(s)`);
      inputs.forEach((input, i) => {
        if (!input.id && !input.name) {
          console.warn(`[DEBUG MISSING ID/NAME ${i}]`, input.outerHTML);
        } else {
          console.log(`[DEBUG INPUT ${i}]`, {
            id: input.id,
            name: input.name,
            outerHTML: input.outerHTML,
          });
        }
      });
    };

    // Run immediately
    logInputs();

    // Watch for new nodes being added
    const observer = new MutationObserver(logInputs);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative isolation-isolate">
      <CustomCursor position={cursor} />
      <main className="p-0 m-0">{children}</main>

      {/* 👇 Footer with socials */}
      <footer className="px-6 py-8 text-center text-sm text-neutral-400">
        <div className="flex justify-center gap-4 mb-3">
          <a
            href="https://www.instagram.com/gamoola3d"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 hover:text-pink-500 transition-colors" />
          </a>
          <a
            href="https://www.facebook.com/gamoola"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5 hover:text-blue-600 transition-colors" />
          </a>
          <a
            href="https://www.linkedin.com/in/company/gamoola"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5 hover:text-blue-700 transition-colors" />
          </a>
          <a
            href="https://twitter.com/Gamoola3d"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5 hover:text-sky-500 transition-colors" />
          </a>
        </div>

        © {new Date().getFullYear()} gamoola. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
