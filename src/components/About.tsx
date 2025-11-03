import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const TYPING_SPEED = 12;

const About = () => {
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const [fullCopy, setFullCopy] = useState<string>("");
  const [displayedCopy, setDisplayedCopy] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [highlightColor, setHighlightColor] = useState<string>("#ff0055");

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
          setFullCopy(record.copy || "");
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

  useEffect(() => {
    if (!fullCopy) return;
    setDisplayedCopy("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedCopy(fullCopy.slice(0, i));
      i++;
      if (i > fullCopy.length) clearInterval(interval);
    }, TYPING_SPEED);
    return () => clearInterval(interval);
  }, [fullCopy]);

  const playHoverSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {});
    }
  };

  return (
    <section
      id="about"
      className="relative px-8 py-24 text-2xl leading-relaxed"
      style={{
        backgroundColor,
        color: textColor,

        // ✅ 4% top slope, steeper downward bottom
        clipPath: "polygon(0 4%, 100% 0, 100% 100%, 0 86%)",
        WebkitClipPath: "polygon(0 4%, 100% 0, 100% 100%, 0 86%)",

        // ✅ fixes divider thickness
        overflow: "visible",
        marginBottom: "-6vw", // pulls Services upward to meet slope
        marginTop: "-1px", // hides hairline gap under Hero
      }}
    >
      <div
        className="max-w-3xl mx-auto prose max-w-none"
        style={{ fontFamily: "'Roboto', sans-serif" }}
      >
        <audio ref={soundRef} preload="auto" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-10"
        >
          <strong className="text-4xl block">
            hi, we're{" "}
            <span
              style={{ color: highlightColor, fontWeight: 700 }}
              className="text-6xl"
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
                className="inline-block cursor-pointer"
                onMouseEnter={playHoverSound}
              >
                {char}
              </motion.span>
            ))}
          </em>{" "}
          – don’t ask),
        </motion.div>

        <div
          className="whitespace-pre-wrap relative text-2xl leading-relaxed border-l-4 border-pink-500 pl-4"
          dangerouslySetInnerHTML={{ __html: displayedCopy }}
        />
      </div>

      <style>
        {`
          .whitespace-pre-wrap::after {
            content: '';
            display: inline-block;
            width: 8px;
            height: 1.4em;
            background: ${highlightColor};
            margin-left: 3px;
            animation: blink 0.8s infinite step-end alternate;
          }
          @keyframes blink { 50% { opacity: 0; } }
        `}
      </style>
    </section>
  );
};

export default About;
