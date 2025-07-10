import { useState } from "react";

type ServiceCardProps = {
  title: string;
  description: string;
  image: string;   // renamed from 'thumbnail'
  video?: string;
};

const ServiceCard = ({
  title,
  description,
  image,
  video,
}: ServiceCardProps) => {
  const [hovered, setHovered] = useState(false);
  console.log("Rendering ServiceCard for:", title);
console.log("Image URL:", image);
console.log("Video URL:", video);



  return (
    <div
      className="relative min-h-[400px] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black bg-opacity-60 text-white p-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
  
  
};

export default ServiceCard;
