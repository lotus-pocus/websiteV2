import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import DotOverlay from "./DotOverlay";

const Hero = () => {
  // --- Overlay state ---
  const [overlayColor, setOverlayColor] = useState("#000000");
  const [overlayOpacity, setOverlayOpacity] = useState(0.35);
  const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

  // --- Debug overlay via ?overlayTest ---
  const search = typeof window !== "undefined" ? window.location.search : "";
  const isDebug = new URLSearchParams(search).has("overlayTest");
  const debugColor = "#FF00FF";
  const debugOpacity = 0.85;

  // --- Existing state ---
  const [showWelcome, setShowWelcome] = useState(true);
  const [showGamoola, setShowGamoola] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  const soundRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {});
    }
  };

  // --- Unlock audio after first user interaction ---
  useEffect(() => {
    const unlockAudio = () => {
      if (soundRef.current) {
        soundRef.current.volume = 0;
        soundRef.current
          .play()
          .then(() => {
            soundRef.current?.pause();
            if (soundRef.current) {
              soundRef.current.currentTime = 0;
              soundRef.current.volume = 0.3;
            }
          })
          .catch(() => {});
      }
      window.removeEventListener("pointerdown", unlockAudio);
    };
    window.addEventListener("pointerdown", unlockAudio);
    return () => window.removeEventListener("pointerdown", unlockAudio);
  }, []);

  // --- Unlock + resume video ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const unlock = () => {
      video.muted = true; // required for autoplay
      video.play().catch(() => {});
    };

    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(video);

    const handlePause = () => {
      if (document.body.contains(video)) {
        video.play().catch(() => {});
      }
    };
    video.addEventListener("pause", handlePause);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      observer.disconnect();
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  // --- Retry video playback once fonts and layout are ready ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.muted = true;
      video.play().catch(() => {});
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(tryPlay);
    }

    window.addEventListener("load", tryPlay);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") tryPlay();
    });

    return () => {
      window.removeEventListener("load", tryPlay);
    };
  }, []);

  // --- Fade-in once video starts playing ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setVideoReady(true);
    video.addEventListener("playing", onPlay);
    return () => video.removeEventListener("playing", onPlay);
  }, []);

  // --- Timed text transitions ---
  useEffect(() => {
    const t1 = setTimeout(() => setShowWelcome(false), 1200);
    const t2 = setTimeout(() => setShowGamoola(true), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // --- Fetch hero video + overlay from Directus ---
  useEffect(() => {
    const fetchHeroVideo = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const token = import.meta.env.VITE_DIRECTUS_TOKEN as string | undefined;

        const url =
          `${base}/items/hero_section` +
          `?fields=video.filename_disk,video.type,overlay_color,overlay_opacity`;

        const headers: Record<string, string> = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(url, { headers });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Directus ${res.status}: ${txt}`);
        }

        const data = await res.json();

        const filename: string | undefined = data?.data?.video?.filename_disk;
        if (filename) {
          const assetUrl = `${base}/assets/${filename}${
            token ? `?access_token=${token}` : ""
          }`;
          setVideoUrl(assetUrl);
        }

        const color = data?.data?.overlay_color ?? "#000000";
        const raw = data?.data?.overlay_opacity;
        const parsed =
          typeof raw === "number" ? raw : parseFloat(raw ?? "0.35");

        setOverlayColor(color);
        setOverlayOpacity(clamp01(Number.isFinite(parsed) ? parsed : 0.35));
      } catch (err) {
        console.error("Failed to fetch hero data:", err);
        setOverlayColor("#000000");
        setOverlayOpacity(0.35);
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
      {/* Audio */}
      <audio ref={soundRef} src="/sfx/pop.mp3" preload="auto" />

      {/* Background Video */}
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
          className="absolute top-0 left-0 w-full h-full object-cover z-0
                     saturate-150 contrast-125 brightness-110"
        >
          <source src={videoUrl} type="video/mp4" />
        </motion.video>
      )}

      {/* Dot pattern overlay (LED look) */}
      <DotOverlay />

      {/* Coloured overlay (richness / hyper-real) */}
      <div
        className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
        style={{ background: "#ff00ff", opacity: 0.2 }}
      />

      {/* Tint Overlay from Directus */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background: isDebug ? debugColor : overlayColor,
          opacity: isDebug ? debugOpacity : overlayOpacity,
        }}
      />

      {/* "Welcome to" */}
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

      {/* GAMOOLA */}
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
