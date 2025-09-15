import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Section from "./Section";

const About = () => {
  const soundRef = useRef<HTMLAudioElement | null>(null);

  const [copy, setCopy] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [highlightColor, setHighlightColor] = useState<string>("#ff0055");

  // Fetch About content
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const res = await fetch(
          `${base}/items/about_section?fields=copy,background_color,text_color,highlight_color`
        );
        const data = await res.json();
        const record = data?.data?.[0];

        if (record) {
          setCopy(record.copy || "");
          setBackgroundColor(record.background_color || "#ffffff");
          setTextColor(record.text_color || "#000000");
          setHighlightColor(record.highlight_color || "#ff0055");
        }
      } catch (err) {
        console.error("Failed to fetch About section:", err);
      }
    };

    fetchAbout();
  }, []);

  // Fetch sound
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
        const volume = record?.volume ?? 1.0;

        if (fileId && soundRef.current) {
          soundRef.current.src = `${base}/assets/${fileId}`;
          soundRef.current.volume = Math.max(0, Math.min(volume, 1.0));
        }
      } catch (err) {
        console.error("Failed to fetch Ga Mooo La sound:", err);
      }
    };

    fetchSound();
  }, []);

  // Unlock audio
  useEffect(() => {
    const unlock = () => {
      if (soundRef.current) {
        soundRef.current
          .play()
          .then(() => {
            soundRef.current?.pause();
            soundRef.current.currentTime = 0;
          })
          .catch(() => {});
      }
      window.removeEventListener("click", unlock);
    };
    window.addEventListener("click", unlock);
    return () => window.removeEventListener("click", unlock);
  }, []);

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {});
    }
  };

  return (
    <Section
      id="about"
      paddingClass="px-8 py-20 text-xl leading-relaxed"
      backgroundColor={backgroundColor}
      textColor={textColor}
    >
      <div className="max-w-3xl mx-auto prose max-w-none">
        <audio ref={soundRef} preload="auto" />

        <p className="mb-6">
          <strong className="text-3xl block">
            hi, we're{" "}
            <span
              style={{
                fontFamily: "'Alfa Slab One', cursive",
                color: highlightColor,
              }}
              className="text-5xl"
            >
              Gamoola
            </span>
          </strong>
          <br />
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
                  color: highlightColor,
                }}
                whileHover={{
                  y: -10,
                  scale: 1.5,
                  rotate: -5,
                  color: highlightColor,
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

        {/* Directus WYSIWYG content */}
        <div dangerouslySetInnerHTML={{ __html: copy }} />
      </div>
    </Section>
  );
};

export default About;
