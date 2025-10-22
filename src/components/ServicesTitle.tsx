// src/components/ServicesTitle.tsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesTitle() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const letters = wrapper.querySelectorAll(".letter");

    gsap.set(letters, { opacity: 0, y: -60, rotateX: 45 });

    ScrollTrigger.create({
      trigger: wrapper,
      start: "top 80%",
      end: "bottom top",
      toggleActions: "restart none none reset",
      onEnter: () => {
        gsap.to(letters, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          ease: "back.out(1.7)",
          stagger: 0.07,
          duration: 0.5,
        });
      },
    });
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="bg-black py-32 flex justify-center text-center"
    >
      <h2 className="text-6xl font-bold text-white tracking-tight flex justify-center gap-1">
        {"our services.".split("").map((char, i) => (
          <span
            key={i}
            className={`letter inline-block ${
              char === " " ? "w-3" : ""
            } ${char === "." ? "text-pink-500" : ""}`}
            style={{ transformOrigin: "center bottom" }}
          >
            {char}
          </span>
        ))}
      </h2>
    </section>
  );
}
