// src/components/ServiceCard.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

type ServiceCardProps = {
  title: string;
  description: string;
  image: string;   // thumbnail / static image
  video?: string;  // hover video
  link?: string;   // internal (/work/:slug) or external (http...)
};

const ServiceCard = ({
  title,
  description,
  image,
  video,
  link,
}: ServiceCardProps) => {
  const [hovered, setHovered] = useState(false);

  const content = (
    <div
      className="relative min-h-[400px] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="link"
      tabIndex={0}
    >
      {/* Thumbnail or hover video */}
      <div className="w-full h-full">
        {video && hovered ? (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
          >
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* Overlay content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black bg-opacity-60 text-white p-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );

  // ✅ Handle link routing
  if (link) {
    if (link.startsWith("http")) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      );
    }
    return <Link to={link}>{content}</Link>;
  }

  return content;
};

export default ServiceCard;
