// src/pages/WorkDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import parse from "html-react-parser";
import VideoModal from "../components/VideoModal"; // 👈 import modal

// Directus file type
type DirectusFile = {
  id: string;
  filename_download: string;
  type: string;
};

// Work block type
type WorkBlock = {
  id: number;
  type: "copy" | "video" | "image";
  copy?: string;
  layout?: string;
  media?: { directus_files_id: DirectusFile }[];
  work_example_id?: { category?: string };
};

// ✅ Slug helper to normalize titles consistently
const toSlug = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric & symbols (like "/")
    .replace(/\s+/g, "-")         // spaces → dash
    .replace(/-+/g, "-");         // collapse multiple dashes

const WorkDetail = () => {
  const { category } = useParams<{ category: string }>();
  const [blocks, setBlocks] = useState<WorkBlock[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

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
    // Copy blocks
    if (block.type === "copy" && block.copy) {
      return (
        <div key={block.id} className="prose max-w-none mb-10 text-white">
          {parse(block.copy)}
        </div>
      );
    }

    // Video blocks
    if (block.type === "video" && block.media?.length) {
      const base = import.meta.env.VITE_DIRECTUS_URL as string;

      if (block.layout === "media-3-col") {
        return (
          <div
            key={block.id}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10"
          >
            {block.media.map((m, idx) => {
              const url = `${base}/assets/${m.directus_files_id.id}`;
              return (
                <video
                  key={`${block.id}-${idx}`}
                  src={url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onClick={() => setSelectedVideo(url)} // 👈 open modal
                  className="w-full h-auto rounded-lg shadow-lg object-contain cursor-pointer"
                />
              );
            })}
          </div>
        );
      }

      // Default stacked videos
      return block.media.map((m, idx) => {
        const url = `${import.meta.env.VITE_DIRECTUS_URL}/assets/${m.directus_files_id.id}`;
        return (
          <video
            key={`${block.id}-${idx}`}
            src={url}
            autoPlay
            loop
            muted
            playsInline
            onClick={() => setSelectedVideo(url)}
            className="mb-10 w-full rounded-lg shadow-lg object-contain cursor-pointer"
          />
        );
      });
    }

    // Image blocks
    if (block.type === "image" && block.media?.length) {
      if (block.layout === "media-3-col") {
        return (
          <div
            key={block.id}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10"
          >
            {block.media.map((m, idx) => (
              <img
                key={`${block.id}-${idx}`}
                src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${m.directus_files_id.id}`}
                alt={m.directus_files_id.filename_download}
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
            ))}
          </div>
        );
      }

      // Default stacked images
      return block.media.map((m, idx) => (
        <img
          key={`${block.id}-${idx}`}
          src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${m.directus_files_id.id}`}
          alt={m.directus_files_id.filename_download}
          className="mb-10 w-full rounded-lg shadow-md object-cover"
        />
      ));
    }

    return null;
  };

  // only keep blocks for the current category
  const filtered = blocks.filter((b) => {
    const cat = b.work_example_id?.category;
    return cat && toSlug(cat) === category;
  });

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <Link to="/work" className="text-pink-400 underline mb-6 inline-block">
        ← Back to All Work
      </Link>

      <h1 className="text-3xl font-bold mb-8">
        {category?.replace(/-/g, " ")}
      </h1>

      {filtered.map((block) => renderBlock(block))}

      {/* 👇 Modal mounts here */}
      {selectedVideo && (
        <VideoModal src={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
};

export default WorkDetail;
