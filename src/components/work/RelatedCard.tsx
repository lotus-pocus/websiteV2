import { useState } from "react";
import { Link } from "react-router-dom";

type RelatedCardProps = {
  title: string;
  description?: string;
  thumbnail: string;
  hoverVideo?: string;
  link?: string;           // can be internal (#hash) or full external URL
  hoverBg?: string;
  hoverTextColor?: string;
};

const RelatedCard = ({
  title,
  description,
  thumbnail,
  hoverVideo,
  link,
  hoverBg = "rgba(0,0,0,0.6)",
  hoverTextColor = "#ffffff",
}: RelatedCardProps) => {
  const [hovered, setHovered] = useState(false);

  const content = (
    <div
      className="group relative aspect-[16/9] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail or hover video */}
      <div className="w-full h-full">
        {hoverVideo && hovered ? (
          <video
            src={hoverVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* Overlay — hidden by default, shown on hover */}
      <div
        className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 
                   opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: hoverBg, color: hoverTextColor }}
      >
        <h3 className="text-xl font-bold">{title}</h3>
        {description && <p className="mt-2 text-sm">{description}</p>}
      </div>
    </div>
  );

  // Decide: internal (react-router) vs external (plain <a>)
  if (link) {
    const isInternal = link.startsWith("/") || link.startsWith("#");
    return isInternal ? (
      <Link to={link}>{content}</Link>
    ) : (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
};

export default RelatedCard;
