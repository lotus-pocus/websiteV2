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

const ServiceCard = ({
  title,
  description,
  image,
  video,
  link,
}: ServiceCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [keepVideo, setKeepVideo] = useState(false); // 👈 keep video briefly after hover

  // detect portrait images
  useEffect(() => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => setIsPortrait(img.height > img.width);
  }, [image]);

  const mediaClass = isPortrait
    ? "object-contain max-h-[400px] mx-auto"
    : "object-cover w-full h-full";

  const handleMouseEnter = () => {
    setHovered(true);
    setKeepVideo(true);
    setVideoLoaded(false);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    // delay unmount to avoid black flash
    setTimeout(() => setKeepVideo(false), 300);
  };

  const content = (
    <div
      className={`
        relative rounded-2xl overflow-hidden shadow-md bg-black
        transition-all duration-500 ease-in-out cursor-pointer
        ${hovered ? "scale-[1.02] z-20" : "scale-100"}
        aspect-[4/3]
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="link"
      tabIndex={0}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Image always visible */}
        <img
          src={image}
          alt={title}
          className={`${mediaClass} rounded-2xl absolute inset-0 transition-opacity duration-500 ${
            hovered && videoLoaded ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
        />

        {/* Keep video visible slightly longer after hover */}
        {video && keepVideo && (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className={`${mediaClass} rounded-2xl absolute inset-0 transition-opacity duration-500 ${
              hovered && videoLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      {/* Overlay text */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 p-4 
          transition-all duration-700 transform
          ${hovered ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
          bg-black/60 text-white rounded-b-2xl
        `}
      >
        <h3 className="text-xl font-bold">{description}</h3>
      </div>
    </div>
  );

  // routing logic
  if (link) {
    return link.startsWith("http") ? (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    ) : (
      <Link to={link}>{content}</Link>
    );
  }

  return content;
};

export default ServiceCard;
