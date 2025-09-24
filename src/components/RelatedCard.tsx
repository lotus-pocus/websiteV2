import { useState } from "react";

type RelatedCardProps = {
  title: string;
  description?: string;
  thumbnail: string;
  hoverVideo?: string;
  link?: string;
  hoverBg?: string;        // 👈 NEW
  hoverTextColor?: string; // 👈 NEW
};

const RelatedCard = ({
  title,
  description,
  thumbnail,
  hoverVideo,
  link,
  hoverBg = "rgba(0,0,0,0.6)", // default fallback
  hoverTextColor = "#ffffff",  // default fallback
}: RelatedCardProps) => {
  const [hovered, setHovered] = useState(false);

  const content = (
    <div
      className="relative min-h-[250px] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer"
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

      {/* Overlay */}
      {hoverVideo ? (
        // Only show overlay when hovered if video exists
        hovered && (
          <div
            className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 transition"
            style={{ backgroundColor: hoverBg, color: hoverTextColor }}
          >
            <h3 className="text-xl font-bold">{title}</h3>
            {description && <p className="mt-2 text-sm">{description}</p>}
          </div>
        )
      ) : (
        // Always show overlay if there’s no video
        <div
          className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 transition"
          style={{ backgroundColor: hoverBg, color: hoverTextColor }}
        >
          <h3 className="text-xl font-bold">{title}</h3>
          {description && <p className="mt-2 text-sm">{description}</p>}
        </div>
      )}
    </div>
  );

  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  );
};

export default RelatedCard;
