// src/components/ServiceCard.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

type ServiceCardProps = {
  title: string;
  description: string; // now used for category in homepage
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

  // ✅ Detect portrait images
  useEffect(() => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      setIsPortrait(img.height > img.width);
    };
  }, [image]);

  const mediaClass = isPortrait
    ? "object-contain max-h-[400px] mx-auto" // 👈 portrait images/videos shrink & center
    : "object-cover w-full h-full"; // 👈 landscape fills card

  const content = (
    <div
      className={`
        relative rounded-2xl overflow-hidden shadow-md 
        transition-all duration-500 ease-in-out cursor-pointer
        ${hovered ? "col-span-2 row-span-2 z-20" : "col-span-1 row-span-1"}
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="link"
      tabIndex={0}
    >
      {/* Media */}
      <div className="w-full h-full flex items-center justify-center bg-black">
        {video && hovered ? (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className={`${mediaClass} rounded-2xl transition-all duration-500 ease-in-out`}
          />
        ) : (
          <img
            src={image}
            alt={title}
            className={`${mediaClass} rounded-2xl transition-all duration-500 ease-in-out`}
            loading="lazy"
          />
        )}
      </div>

      {/* Overlay - slides in from left */}
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

  // Routing
  if (link) {
    return link.startsWith("http")
      ? (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      )
      : <Link to={link}>{content}</Link>;
  }

  return content;
};

export default ServiceCard;
