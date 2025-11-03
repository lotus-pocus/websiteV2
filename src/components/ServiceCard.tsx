// src/components/ServiceCard.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

type ServiceCardProps = {
  title: string;
  description: string;
  image: string;
  video?: string;
  link?: string;
  autoplay?: boolean; // homepage autoplay
};

const ServiceCard = ({
  title,
  description,
  image,
  video,
  link,
  autoplay = false,
}: ServiceCardProps) => {
  // ✅ Hooks are always declared first — same order every render
  const [isPortrait, setIsPortrait] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keepVideo, setKeepVideo] = useState(false);

  // Detect portrait images
  useEffect(() => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => setIsPortrait(img.height > img.width);
  }, [image]);

  const mediaClass = isPortrait
    ? "object-contain w-full h-full"
    : "object-cover w-full h-full";

  // Handlers (only used when not autoplay)
  const handleMouseEnter = () => {
    if (!autoplay) {
      setHovered(true);
      setKeepVideo(true);
      setVideoLoaded(false);
    }
  };

  const handleMouseLeave = () => {
    if (!autoplay) {
      setHovered(false);
      setTimeout(() => setKeepVideo(false), 300);
    }
  };

  // ✅ Shared structure for both modes
  const cardInner = (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="link"
      tabIndex={0}
      className={`relative overflow-hidden bg-neutral-900 shadow-lg transition-all duration-500 ease-[cubic-bezier(0.25,1,0.3,1)] cursor-pointer ${
        hovered && !autoplay ? "scale-[1.02]" : "scale-100"
      }`}
      style={{
        width: "640px",
        height: "360px",
        maxWidth: "100%",
        aspectRatio: "16 / 9",
      }}
    >
      {/* Base image (hidden when video visible) */}
      <img
        src={image}
        alt={title}
        className={`${mediaClass} transition-opacity duration-500 ${
          (autoplay && videoLoaded) || (hovered && videoLoaded)
            ? "opacity-0"
            : "opacity-100"
        }`}
        loading="lazy"
      />

      {/* Video (autoplay OR hover) */}
      {video && (autoplay || keepVideo) && (
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          className={`${mediaClass} absolute inset-0 transition-opacity duration-700 ${
            (autoplay && videoLoaded) || (hovered && videoLoaded)
              ? "opacity-100"
              : "opacity-0"
          }`}
        />
      )}

      {/* Overlay Text */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 ${
          autoplay
            ? "bg-black/50 text-white opacity-100"
            : `bg-black/60 text-white ${
                hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              }`
        }`}
      >
        <h3 className="text-lg font-semibold">{description}</h3>
      </div>
    </div>
  );

  // ✅ Link wrapping logic
  if (link) {
    return link.startsWith("http") ? (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {cardInner}
      </a>
    ) : (
      <Link to={link}>{cardInner}</Link>
    );
  }

  return cardInner;
};

export default ServiceCard;
