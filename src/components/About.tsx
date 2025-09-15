import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const About = () => {
  const soundRef = useRef<HTMLAudioElement | null>(null);

  // Fetch the audio file and volume from Directus by name
  useEffect(() => {
    const fetchSound = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const res = await fetch(
          `${base}/items/sound_effects?filter[name][_eq]=ga_mooo_la_hover&fields=file.id,volume`
        );
        const data = await res.json();
        const record = data?.data?.[0];
        const fileId = record?.file?.id;
        const volume = record?.volume ?? 1.0; // fallback to full volume

        if (fileId && soundRef.current) {
          soundRef.current.src = `${base}/assets/${fileId}`;
          // Clamp volume to [0.0, 1.0]
          soundRef.current.volume = Math.max(0, Math.min(volume, 1.0));
          console.log(
            "Loaded Ga Mooo La sound:",
            soundRef.current.src,
            "Volume:",
            soundRef.current.volume
          );
        }
      } catch (err) {
        console.error("Failed to fetch Ga Mooo La sound:", err);
      }
    };

    fetchSound();
  }, []);

  // Unlock audio on first click/tap
  useEffect(() => {
    const unlock = () => {
      if (soundRef.current) {
        soundRef.current
          .play()
          .then(() => {
            soundRef.current?.pause();
            soundRef.current.currentTime = 0;
            console.log("Audio unlocked ✅");
          })
          .catch((err) => console.warn("Unlock failed:", err));
      }
      window.removeEventListener("click", unlock);
    };
    window.addEventListener("click", unlock);
    return () => window.removeEventListener("click", unlock);
  }, []);

  // Play sound on hover
  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current
        .play()
        .then(() => console.log("Sound playing!"))
        .catch((err) => console.error("Play failed:", err));
    }
  };

  return (
    <section className="bg-white text-black px-8 py-20 text-xl leading-relaxed">
      <div className="max-w-3xl mx-auto">
        {/* Audio element will be populated dynamically */}
        <audio ref={soundRef} preload="auto" />

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
          a creative, design, animation and tech studio in Portobello, west
          London.
          <br />
          Crafting Immersive Experiences That Stick <br />
          <strong>Interactive Experiences | VR | AR | WebGL</strong> <br />
          We turn ideas into interactive realities... fast, flexible, and
          beautifully built. <br />
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
