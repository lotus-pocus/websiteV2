import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

// TEMP DEBUG: check if token is loading correctly from .env
console.log("TOKEN from VITE env:", import.meta.env.VITE_DIRECTUS_TOKEN);

const Hero = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showGamoola, setShowGamoola] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const soundRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {});
    }
  };

  // Unlock audio after first user interaction
  useEffect(() => {
    const unlockAudio = () => {
      if (soundRef.current) {
        soundRef.current.volume = 0; // Silent
        soundRef.current
          .play()
          .then(() => {
            soundRef.current.pause();
            soundRef.current.currentTime = 0;
            soundRef.current.volume = 0.3; // Set your desired volume
          })
          .catch(() => {});
      }
      window.removeEventListener("pointerdown", unlockAudio);
    };

    window.addEventListener("pointerdown", unlockAudio);
    return () => window.removeEventListener("pointerdown", unlockAudio);
  }, []);

  useEffect(() => {
    const welcomeTimer = setTimeout(() => setShowWelcome(false), 1200);
    const gamoolaTimer = setTimeout(() => setShowGamoola(true), 1400);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(gamoolaTimer);
    };
  }, []);
  // 🔥 Fetch hero video from Directus
  useEffect(() => {
    const fetchHeroVideo = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_DIRECTUS_URL}/items/hero_section?fields=video.filename_disk,video.type`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_DIRECTUS_TOKEN}`,
            },
          }
        );

        const data = await res.json();
        const filename = data?.data?.video?.filename_disk;

        if (filename) {
          setVideoUrl(
            `${import.meta.env.VITE_DIRECTUS_URL}/assets/${filename}`
          );
        }
      } catch (err) {
        console.error("Failed to fetch hero video:", err);
      }
    };

    fetchHeroVideo();
  }, []);
  return (
    <section
      className="relative w-full h-screen bg-black text-white overflow-hidden z-0"
      data-theme="dark"
      style={{ marginTop: 0, paddingTop: 0, top: 0 }}
    >
      {/* Audio element */}
      <audio ref={soundRef} src="/sfx/pop.mp3" preload="auto" />

      {/* Background Video (now dynamic) */}
      {videoUrl && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* "Welcome to" flipping letters */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 flex gap-2 z-40"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.04,
                  delayChildren: 0.1,
                },
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

      {/* GAMOOLA - rainbow wobble */}
      {showGamoola && (
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: 720 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          whileHover="hover"
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 z-50 cursor-none"
          data-cursor="burger"
        >
          {"GAMOOLA".split("").map((char, i) => (
            <motion.span
              key={i}
              data-cursor="hover"
              onMouseEnter={playSound}
              variants={{
                hover: {
                  color: [
                    "#ff0000",
                    "#ffa500",
                    "#ffff00",
                    "#00ff00",
                    "#0000ff",
                    "#4b0082",
                    "#ee82ee",
                  ],
                  scale: [1, 1.4, 0.8, 1.2, 1],
                  rotate: [-8, 8, -4, 4, 0],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  },
                },
              }}
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
