// src/pages/LabDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import parse from "html-react-parser";
import LabsHeaderWave from "../components/LabsHeaderWave";

type DirectusFile = { id: string };

type Lab = {
  id: number;
  title: string;
};

type LabBlock = {
  id: number;
  type: "banner_video" | "copy" | "single_media" | "col_2";
  copy?: string;
  media?: { directus_files_id: DirectusFile }[];
};

// ✅ Move base URL to module scope so it's not a hook dependency
const DIRECTUS_BASE = import.meta.env.VITE_DIRECTUS_URL as string;

const LabDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [lab, setLab] = useState<Lab | null>(null);
  const [blocks, setBlocks] = useState<LabBlock[]>([]);

  useEffect(() => {
    const fetchLabAndBlocks = async () => {
      try {
        // Fetch Lab project
        const labRes = await fetch(
          `${DIRECTUS_BASE}/items/labs/${id}?fields=id,title`
        );
        const labData = await labRes.json();
        setLab(labData?.data || null);

        // Fetch associated blocks
        const blocksRes = await fetch(
          `${DIRECTUS_BASE}/items/labs_blocks?filter[lab_id][_eq]=${id}&fields=id,type,copy,media.directus_files_id.id&sort=sort`
        );
        const blocksData = await blocksRes.json();
        setBlocks(blocksData.data || []);
      } catch (err) {
        console.error("Failed to fetch lab detail:", err);
      }
    };

    if (id) fetchLabAndBlocks();
  }, [id]); // ✅ only depends on id

  return (
    <div className="bg-black text-white min-h-screen relative">
      {/* Wave Background - sits ABOVE banner */}
      <div className="absolute top-0 left-0 w-full h-[480px] overflow-hidden z-20">
        <LabsHeaderWave />
      </div>

      {/* Back Link */}
      <div className="relative z-30 px-6 pt-6">
        <Link
          to="/labs"
          className="inline-block text-white font-semibold text-lg tracking-wide transition-all duration-300 hover:text-cyan-300 hover:drop-shadow-[0_0_6px_rgba(103,232,249,0.7)]"
        >
          ← Back to Labs
        </Link>
      </div>

      {/* Project Title (higher) */}
      <div className="relative z-30 flex justify-center pt-12 h-[200px] md:h-[220px] lg:h-[240px]">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center">
          {lab?.title || "Loading…"}
        </h1>
      </div>

      {/* Project Content Blocks */}
      <div className="relative z-10">
        {blocks.length > 0 ? (
          blocks.map((block) => {
            // Banner Video (pulled up, behind wave)
            if (
              block.type === "banner_video" &&
              block.media &&
              block.media.length > 0
            ) {
              return (
                <div
                  key={block.id}
                  className="relative w-full max-w-7xl mx-auto -mt-40 mb-16 z-10"
                >
                  <video
                    src={`${DIRECTUS_BASE}/assets/${block.media[0].directus_files_id.id}`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-[80vh] object-contain rounded-xl shadow-lg"
                  />
                </div>
              );
            }

            // Copy block (wider)
            if (block.type === "copy" && block.copy) {
              return (
                <div
                  key={block.id}
                  className="max-w-6xl mx-auto px-10 py-12 prose prose-lg prose-invert"
                >
                  {parse(block.copy)}
                </div>
              );
            }

            // Single media block
            if (
              block.type === "single_media" &&
              block.media &&
              block.media.length > 0
            ) {
              return (
                <div
                  key={block.id}
                  className="w-full max-w-6xl mx-auto my-12 px-10"
                >
                  <img
                    src={`${DIRECTUS_BASE}/assets/${block.media[0].directus_files_id.id}`}
                    className="w-full object-contain rounded-xl shadow-lg"
                  />
                </div>
              );
            }

            // 2-column media block
            if (
              block.type === "col_2" &&
              block.media &&
              block.media.length >= 2
            ) {
              return (
                <div
                  key={block.id}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto p-10"
                >
                  {block.media.slice(0, 2).map((m) => (
                    <img
                      key={m.directus_files_id.id}
                      src={`${DIRECTUS_BASE}/assets/${m.directus_files_id.id}`}
                      className="w-full object-contain rounded-lg shadow"
                    />
                  ))}
                </div>
              );
            }

            return null;
          })
        ) : (
          <p className="text-gray-400 italic px-10">No content yet.</p>
        )}
      </div>
    </div>
  );
};

export default LabDetail;
