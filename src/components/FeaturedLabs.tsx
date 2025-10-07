import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LabsHeaderWave from "./LabsHeaderWave";
import RelatedCard from "../components/work/RelatedCard";
import parse from "html-react-parser";

type Lab = {
  id: number;
  title: string;
  description?: string;
  thumbnail?: { id: string };
  hover_video?: { id: string };
};

const funFonts = [
  "'Bangers', cursive",
  "'Caveat', cursive",
  "'Pacifico', cursive",
  "'Press Start 2P', cursive",
  "'Comic Neue', cursive",
];

const FeaturedLabs = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [fontIndex, setFontIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setFontIndex((i) => (i + 1) % funFonts.length), 1500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const base = import.meta.env.VITE_DIRECTUS_URL as string;
    fetch(
      `${base}/items/labs?filter[featured][_eq]=true&fields=id,title,description,thumbnail.id,hover_video.id&sort=-date`
    )
      .then((r) => r.json())
      .then((d) => setLabs(d.data || []))
      .catch((e) => console.error("Failed to fetch labs:", e));
  }, []);

  if (!labs.length) return null;
  const featuredLab = labs[0];

  return (
    <section className="relative bg-black text-white py-28 px-6 overflow-hidden">
      {/* Background Wave */}
      <div className="absolute top-0 left-0 w-full h-[320px] opacity-80 pointer-events-none">
        <LabsHeaderWave />
      </div>

      {/* LABS TITLE */}
      <div className="relative z-10 flex flex-col items-center justify-center mb-20 select-none">
        {/* Soft pulsing halo */}
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />

        {/* Cycling Labs text */}
        <motion.div
          key={fontIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/labs"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="text-7xl md:text-8xl lg:text-9xl relative transition-all duration-500"
            style={{
              fontFamily: funFonts[fontIndex],
              color: hovered ? "#67e8f9" : "white",
              textShadow: hovered
                ? "0 0 15px rgba(103,232,249,0.8)"
                : "0 0 10px rgba(255,255,255,0.2)",
            }}
          >
            Labs
          </Link>
        </motion.div>

        {/* Click cue */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
          className="mt-4 flex items-center gap-2 text-cyan-400 text-base uppercase"
        >
          <span>Click Here</span>
          <span className="material-symbols-outlined text-2xl">touch_app</span>
        </motion.div>

        {/* Tagline */}
        <p className="mt-16 text-pink-400 text-lg uppercase tracking-[0.25em]">
          experiments • play • innovation
        </p>
      </div>

      {/* Featured Lab */}
      {featuredLab && (
        <div className="relative z-10 flex flex-col items-center justify-center mt-20 mb-24">
          <Link
            to={`/labs/${featuredLab.id}`}
            className="block w-full max-w-5xl rounded-3xl overflow-hidden group"
          >
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-xl">
              {featuredLab.hover_video ? (
                <video
                  src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${featuredLab.hover_video.id}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${featuredLab.thumbnail?.id}`}
                  alt={featuredLab.title}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-3xl font-bold">{featuredLab.title}</h3>
                {featuredLab.description && (
                  <div className="text-sm max-w-md text-gray-300 mt-2 leading-snug">
                    {parse(featuredLab.description)}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Remaining Labs */}
      <div className="relative z-10 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {labs.slice(1).map((lab) => (
          <RelatedCard
            key={lab.id}
            title={lab.title}
            description={
              lab.description ? (
                <div className="prose prose-invert">{parse(lab.description)}</div>
              ) : undefined
            }
            thumbnail={
              lab.thumbnail
                ? `${import.meta.env.VITE_DIRECTUS_URL}/assets/${lab.thumbnail.id}`
                : ""
            }
            hoverVideo={
              lab.hover_video
                ? `${import.meta.env.VITE_DIRECTUS_URL}/assets/${lab.hover_video.id}`
                : undefined
            }
            link={`/labs/${lab.id}`}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedLabs;
