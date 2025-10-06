import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

export type RelatedCardProps = {
  title: string;
  description?: React.ReactNode;
  thumbnail: string;
  hoverVideo?: string;
  link?: string;
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
  const [isPortrait, setIsPortrait] = useState(false);

  // ✅ Detect aspect ratio only for images
  useEffect(() => {
    if (!thumbnail) return;
    const img = new Image();
    img.src = thumbnail;
    img.onload = () => {
      setIsPortrait(img.height > img.width);
    };
  }, [thumbnail]);

  const mediaClass = useMemo(
    () =>
      isPortrait
        ? "absolute inset-0 w-full h-full object-contain transition-transform duration-500 ease-in-out bg-black"
        : "absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out",
    [isPortrait]
  );

  const card = (
    <div
      className="
        relative rounded-xl overflow-hidden shadow-md 
        transition-transform duration-500 ease-in-out 
        cursor-pointer hover:scale-105
      "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail / Hover Video */}
      <div className="w-full aspect-video relative bg-black">
        {hoverVideo && hovered ? (
          <video
            src={hoverVideo}
            autoPlay
            loop
            muted
            playsInline
            className={mediaClass}
          />
        ) : (
          <img
            src={thumbnail}
            alt={title}
            className={mediaClass}
            loading="lazy"
          />
        )}
      </div>

      {/* Overlay text, sliding from left */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 p-3 
          transform transition-all duration-700 ease-in-out
          ${hovered ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
        `}
        style={{
          background: hoverBg,
          color: hoverTextColor,
          borderBottomLeftRadius: "0.75rem",
          borderBottomRightRadius: "0.75rem",
        }}
      >
        <h3 className="text-lg font-bold">{title}</h3>
        {description && (
          <div className="text-sm opacity-90 prose prose-invert">
            {typeof description === "string" ? description : description}
          </div>
        )}
      </div>
    </div>
  );

  return link ? <Link to={link}>{card}</Link> : card;
};

export default RelatedCard;
