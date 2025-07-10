import { motion } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const soundRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {});
    }
  };

  return (
    <section className="bg-white text-black px-8 py-20 text-xl leading-relaxed">
      <div className="max-w-3xl mx-auto">
        <audio ref={soundRef} src="/sfx/ga_mooo_la.mp3" preload="auto" />

        <p className="mb-6">
          <strong className="text-3xl block">
            hi, we're{" "}
            <span
  style={{ fontFamily: "'Alfa Slab One', cursive", color: "#ff0055" }}
  className="text-5xl"
>
  Gamoola
</span>

          </strong>
          (we say it{" "}
          <em className="inline-block">
            {"ga_mooo_la".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: 40, opacity: 0, scale: 0.8 }}
                whileInView={{
                  y: 0,
                  opacity: 1,
                  scale: 1.2,
                  color: "#000",
                }}
                whileHover={{
                  y: -10,
                  scale: 1.5,
                  rotate: -5,
                  color: "#ff0055",
                }}
                transition={{
                  delay: i * 0.05,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                viewport={{ once: false, amount: 0.5 }}
                className="inline-block font-fun cursor-pointer"
                onMouseEnter={playSound}
              >
                {char}
              </motion.span>
            ))}
          </em>{" "}
          – don’t ask),
        </p>

        <p className="mb-6">
          a creative, design, animation and tech studio in Portobello, west London.<br/>
          Crafting Immersive Experiences That Stick <br />
          <strong>Interactive Experiences | VR | AR | WebGL</strong> <br />
          We turn ideas into interactive realities... fast, flexible, and beautifully built. <br />
          [Let’s Build Together!]
        </p>

        <p>
          have a look below at what we do and if you like it get in touch at{" "}
          <a href="mailto:hello@gamoola.com" className="underline">
            hello@gamoola.com
          </a>
          <br /> it would be great to chat.
        </p>
      </div>
    </section>
  );
};

export default About;
