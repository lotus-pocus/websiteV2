// src/pages/Labs.tsx
import { useEffect, useState } from "react";
import RelatedCard from "../components/work/RelatedCard"; // adjust path if needed
import parse from "html-react-parser";

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
};

const Labs = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [header, setHeader] = useState<LabsHeader | null>(null);

  useEffect(() => {
    const base = import.meta.env.VITE_DIRECTUS_URL as string;

    const fetchHeaderAndLabs = async () => {
      try {
        // Header singleton
        const headerRes = await fetch(
          `${base}/items/labs_header?fields=title,header_image.id`
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
    <div className="min-h-screen bg-black text-white p-10">
      {/* Header Block */}
      <div className="flex items-center gap-8 mb-20">
        {header?.header_image && (
          <img
            src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${header.header_image.id}`}
            alt="Labs icon"
            className="h-20 w-20 md:h-28 md:w-28 lg:h-40 lg:w-40 object-contain"
          />
        )}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
          {header?.title || "Labs"}
        </h1>
      </div>

      {/* Labs Grid */}
      {labs.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
        <p className="text-gray-400 italic">No experiments yet.</p>
      )}
    </div>
  );
};

export default Labs;
