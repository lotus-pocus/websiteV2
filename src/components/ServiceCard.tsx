// src/components/ServiceCard.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

type ServiceCardProps = {
  title: string;
  description: string;
  image: string;
  video?: string;
  link?: string;
};

const ServiceCard = ({ title, description, image, video, link }: ServiceCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [keepVideo, setKeepVideo] = useState(false);

  /* Detect portrait images */
  useEffect(() => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => setIsPortrait(img.height > img.width);
  }, [image]);

  const handleMouseEnter = () => {
    setHovered(true);
    setKeepVideo(true);
    setVideoLoaded(false);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTimeout(() => setKeepVideo(false), 300);
  };

  /* ✅ Always fill the 16:9 box */
  const mediaClass = isPortrait
    ? "object-contain w-full h-full"
    : "object-cover w-full h-full";

  /* ✅ Main Card */
  const card = (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="link"
      tabIndex={0}
      className={`relative overflow-hidden bg-neutral-900
        shadow-lg transition-all duration-500 ease-[cubic-bezier(0.25,1,0.3,1)]
        cursor-pointer ${hovered ? "scale-[1.02]" : "scale-100"}`}
      style={{
        width: "640px",        // fixed size
        height: "360px",       // fixed size
        maxWidth: "100%",      // responsive fallback
        aspectRatio: "16 / 9", // ensures consistency
      }}
    >
      {/* ---- Base Image ---- */}
      <img
        src={image}
        alt={title}
        className={`${mediaClass} transition-opacity duration-500 ${
          hovered && videoLoaded ? "opacity-0" : "opacity-100"
        }`}
        loading="lazy"
      />

      {/* ---- Hover Video ---- */}
      {video && keepVideo && (
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`${mediaClass} absolute inset-0 transition-opacity duration-700 ${
            hovered && videoLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* ---- Overlay Text ---- */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 
          bg-black/60 text-white transition-all duration-500
          ${hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
      >
        <h3 className="text-lg font-semibold">{description}</h3>
      </div>
    </div>
  );

  /* Routing */
  if (link) {
    return link.startsWith("http") ? (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {card}
      </a>
    ) : (
      <Link to={link}>{card}</Link>
    );
  }

  return card;
};

export default ServiceCard;
