import { useState } from "react";

type RelatedCardProps = {
  title: string;
  description?: string;
  thumbnail: string;
  hoverVideo?: string;
  link?: string;
};

const RelatedCard = ({
  title,
  description,
  thumbnail,
  hoverVideo,
  link,
}: RelatedCardProps) => {
  const [hovered, setHovered] = useState(false);

  const content = (
    <div
      className="relative min-h-[250px] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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

      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3">
        <h3 className="text-lg font-bold">{title}</h3>
        {description && <p className="text-sm">{description}</p>}
      </div>
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
