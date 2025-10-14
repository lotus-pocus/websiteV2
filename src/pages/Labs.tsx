// src/pages/Labs.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // ✅ for animations
import RelatedCard from "../components/work/RelatedCard"; // adjust path if needed
import parse from "html-react-parser";
import LabsHeaderWave from "../components/LabsHeaderWave";
import Layout from "../components/Layout";

type Lab = {
  id: number;
  title: string;
  description?: string; // HTML from WYSIWYG
  thumbnail?: { id: string };
  hover_video?: { id: string };
};

type LabsHeader = {
  title?: string;
  header_image?: { id: string };
  show_header_image?: boolean;
};

const Labs = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [header, setHeader] = useState<LabsHeader | null>(null);

  // ✅ Fonts to cycle through
  const funFonts = [
    "'Bangers', cursive",
    "'Caveat', cursive",
    "'Pacifico', cursive",
    "'Press Start 2P', cursive",
    "'Comic Neue', cursive",
  ];
  const [fontIndex, setFontIndex] = useState(0);

  useEffect(() => {
    const base = import.meta.env.VITE_DIRECTUS_URL as string;

    const fetchHeaderAndLabs = async () => {
      try {
        // Header singleton (with toggle + image)
        const headerRes = await fetch(
          `${base}/items/labs_header?fields=title,header_image.id,show_header_image`
        );
        const headerData = await headerRes.json();
        setHeader(headerData?.data || null);

        // Labs collection
        const labsRes = await fetch(
          `${base}/items/labs?fields=id,title,description,thumbnail.id,hover_video.id&sort=-date`
        );
        const labsData = await labsRes.json();
        setLabs(labsData.data || []);
      } catch (err) {
        console.error("Failed to fetch labs:", err);
      }
    };

    fetchHeaderAndLabs();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        {/* Header with wave */}
        <div className="relative h-[300px] md:h-[340px] lg:h-[380px] flex justify-center items-start pt-30 mb-20 overflow-hidden">
          <LabsHeaderWave />
          <div className="relative z-10 flex items-center gap-6">
            {/* Only show PNG if toggle is enabled */}
            {header?.show_header_image && header?.header_image && (
              <img
                src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${header.header_image.id}`}
                alt="Labs icon"
                className="h-20 md:h-28 lg:h-32 w-auto object-contain"
              />
            )}

            {/* ✅ Animated Title */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold cursor-pointer"
              style={{ fontFamily: funFonts[fontIndex] }}
              onMouseEnter={() =>
                setFontIndex((prev) => (prev + 1) % funFonts.length)
              }
              animate={{
                scale: [1, 1.2, 1],
                color: ["#ffffff", "#ff3399", "#ffffff"],
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {header?.title || "Labs"}
            </motion.h1>
          </div>
        </div>

        {/* Labs Grid */}
        {labs.length > 0 ? (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-10">
            {labs.map((lab) => (
              <RelatedCard
                key={lab.id}
                title={lab.title}
                description={
                  lab.description ? (
                    <div className="prose prose-invert">
                      {parse(lab.description)}
                    </div>
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
        ) : (
          <p className="text-gray-400 italic px-10">No experiments yet.</p>
        )}
      </div>
    </Layout>
  );
};

export default Labs;
