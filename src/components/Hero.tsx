import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import DotOverlay from "./DotOverlay";

const Hero = () => {
  const [overlayColor, setOverlayColor] = useState("#000000");
  const [overlayOpacity, setOverlayOpacity] = useState(0.35);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showGamoola, setShowGamoola] = useState(false);

  const soundRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // --- unlock + fetch video (same as before, trimmed for clarity) ---
  useEffect(() => {
    const base = import.meta.env.VITE_DIRECTUS_URL as string;
    const token = import.meta.env.VITE_DIRECTUS_TOKEN as string | undefined;

    const fetchHero = async () => {
      try {
        const res = await fetch(
          `${base}/items/hero_section?fields=video.filename_disk,overlay_color,overlay_opacity`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );
        const data = await res.json();
        const filename = data?.data?.video?.filename_disk;
        if (filename) {
          const assetUrl = `${base}/assets/${filename}${
            token ? `?access_token=${token}` : ""
          }`;
          setVideoUrl(assetUrl);
        }
        const color = data?.data?.overlay_color ?? "#000000";
        const opacity = parseFloat(data?.data?.overlay_opacity ?? "0.35");
        setOverlayColor(color);
        setOverlayOpacity(Math.min(1, Math.max(0, opacity)));
      } catch (err) {
        console.error("Failed to fetch hero:", err);
      }
    };

    fetchHero();
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setShowWelcome(false), 1200);
    const t2 = setTimeout(() => setShowGamoola(true), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <section
      className="relative w-full h-screen text-white overflow-hidden z-0"
      style={{
        background: "transparent",
        margin: 0,
        padding: 0,
        clipPath: "polygon(0 0,100% 0,100% 95%,0 100%)", // 👈 bottom diagonal cut
        WebkitClipPath: "polygon(0 0,100% 0,100% 95%,0 100%)",
        marginBottom: "-1vw"
      }}
    >
      <audio ref={soundRef} src="/sfx/pop.mp3" preload="auto" />

      <div className="absolute inset-0">
        {videoUrl && (
          <motion.video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoReady(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: videoReady ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-0 left-0 w-full h-full object-cover z-0 saturate-150 contrast-125 brightness-110"
          >
            <source src={videoUrl} type="video/mp4" />
          </motion.video>
        )}

        <DotOverlay />

        {/* overlays */}
        <div
          className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
          style={{ background: "#ff00ff", opacity: 0.2 }}
        />
        <div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ background: overlayColor, opacity: overlayOpacity }}
        />
      </div>

      {/* text */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 flex gap-2 z-40"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            variants={{
              visible: {
                transition: { staggerChildren: 0.04, delayChildren: 0.1 },
              },
            }}
          >
            {"Welcome to".split("").map((char, i) => (
              <motion.span
                key={i}
                className="text-[4vw] font-extrabold text-white"
                variants={{
                  hidden: { rotateY: 90, opacity: 0 },
                  visible: {
                    rotateY: 0,
                    opacity: 1,
                    transition: { duration: 0.3, ease: "easeOut" },
                  },
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {showGamoola && (
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: 720 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 z-50 cursor-none"
        >
          {"GAMOOLA".split("").map((char, i) => (
            <motion.span
              key={i}
              className="text-[10vw] font-extrabold leading-[1.1] whitespace-nowrap text-white"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default Hero;
