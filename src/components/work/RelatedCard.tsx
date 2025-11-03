import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // 👈 added

export type RelatedCardProps = {
  title: string;
  description?: React.ReactNode;
  thumbnail: string;
  hoverVideo?: string;
  link?: string;
  hoverBg?: string;
  hoverTextColor?: string;
  gallery?: { id: string }[];
  index?: number; // 👈 optional, allows stagger timing later
};

const RelatedCard = ({
  title,
  description,
  thumbnail,
  hoverVideo,
  link,
  hoverBg = "rgba(0,0,0,0.6)",
  hoverTextColor = "#ffffff",
  gallery = [],
  index = 0,
}: RelatedCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  /* ---------- Detect aspect ratio ---------- */
  useEffect(() => {
    if (!thumbnail) return;
    const img = new Image();
    img.src = thumbnail;
    img.onload = () => {
      setIsPortrait(img.height > img.width);
    };
  }, [thumbnail]);

  /* ---------- Cycle gallery ---------- */
  useEffect(() => {
    if (!hovered || !gallery.length) return;
    const interval = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % gallery.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [hovered, gallery]);

  const mediaClass = useMemo(
    () =>
      isPortrait
        ? "absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out bg-black"
        : "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out",
    [isPortrait]
  );

  const currentImage =
    gallery.length > 0
      ? `${import.meta.env.VITE_DIRECTUS_URL}/assets/${gallery[galleryIndex].id}`
      : thumbnail;

  /* ---------- Card ---------- */
  const card = (
    <motion.div
      style={{ isolation: "auto" }} // 👈 add this line
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        delay: index * 0.1,
      }}
      viewport={{ once: true, amount: 0.2 }}
      className="
    relative overflow-hidden shadow-md 
    transition-transform duration-500 ease-in-out 
    cursor-pointer hover:scale-[1.02]
  "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Media Layer */}
      <div className="relative w-full aspect-video bg-black">
        {/* Base image — always visible */}
        <img
          src={currentImage}
          alt={title}
          className={`${mediaClass}`}
          loading="lazy"
          style={{ opacity: hovered ? 0 : 1 }}
        />

        {/* Hover video — preloaded, smoothly faded */}
        {hoverVideo && (
          <video
            src={hoverVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={`${mediaClass}`}
            style={{
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.6s ease-in-out",
            }}
          />
        )}
      </div>

      {/* Overlay text */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 p-4 
          transform transition-all duration-700 ease-in-out
          ${hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
        `}
        style={{
          background: hoverBg,
          color: hoverTextColor,
        }}
      >
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        {description && (
          <div className="text-sm opacity-90 prose prose-invert">
            {description}
          </div>
        )}
      </div>
    </motion.div>
  );

  return link ? <Link to={link}>{card}</Link> : card;
};

export default RelatedCard;
