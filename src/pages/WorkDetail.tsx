// src/pages/WorkDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import parse from "html-react-parser";

type DirectusFile = {
  id: string;
  filename_download: string;
  type: string;
};

type WorkBlock = {
  id: number;
  type: "copy" | "video" | "image";
  copy?: string;
  layout?: string;
  media?: { directus_files_id: DirectusFile }[];
  work_example_id?: { category?: string };
};

const WorkDetail = () => {
  const { category } = useParams<{ category: string }>();
  const [blocks, setBlocks] = useState<WorkBlock[]>([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const res = await fetch(
          `${base}/items/work_blocks?fields=id,type,copy,layout,media.directus_files_id.*,work_example_id.category`
        );
        const data = await res.json();
        setBlocks(data.data);
      } catch (err) {
        console.error("Failed to fetch work blocks:", err);
      }
    };

    fetchBlocks();
  }, []);

  const renderBlock = (block: WorkBlock) => {
    if (block.type === "copy" && block.copy) {
      return (
        <div key={block.id} className="prose max-w-none mb-10 text-white">
          {parse(block.copy)}
        </div>
      );
    }

    if (block.type === "video" && block.media?.length) {
      return block.media.map((m, idx) => (
        <video
          key={`${block.id}-${idx}`}
          src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${m.directus_files_id.id}`}
          autoPlay
          loop
          muted
          playsInline
          className="mb-10 w-full rounded-lg shadow-lg"
        />
      ));
    }

    if (block.type === "image" && block.media?.length) {
      return block.media.map((m, idx) => (
        <img
          key={`${block.id}-${idx}`}
          src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${m.directus_files_id.id}`}
          alt={m.directus_files_id.filename_download}
          className="mb-10 w-full rounded-lg shadow-md"
        />
      ));
    }

    return null;
  };

  const filtered = blocks.filter(
    (b) => b.work_example_id?.category?.toLowerCase().replace(/\s+/g, "-") === category
  );

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <Link to="/work" className="text-pink-400 underline mb-6 inline-block">
        ← Back to All Work
      </Link>

      <h1 className="text-3xl font-bold mb-8">{category?.replace(/-/g, " ")}</h1>

      {filtered.map((block) => renderBlock(block))}
    </div>
  );
};

export default WorkDetail;
