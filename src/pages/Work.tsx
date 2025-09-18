import { useEffect, useState } from "react";
import parse from "html-react-parser";

type DirectusFile = {
  id: string;
  filename_download: string;
  type: string;
};

type Tag = {
  id: number;
  name: string;
  slug?: string;
};

type WorkBlock = {
  id: number;
  type: "copy" | "video" | "image";
  copy?: string;
  layout?: string;
  media?: { directus_files_id: DirectusFile }[];
  work_example_id?: {
    category?: string;
    tags?: Tag[];
  };
};

// ✅ normalize category → kebab-case id
const toKebabCase = (str: string) =>
  str.toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-");

const HEADER_OFFSET = 100; // matches ScrollToHash.tsx

const Work = () => {
  const [blocks, setBlocks] = useState<WorkBlock[]>([]);

  // Fetch blocks
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const res = await fetch(
          `${base}/items/work_blocks?fields=id,type,copy,layout,media.directus_files_id.*,work_example_id.category,work_example_id.tags.*`
        );
        const data = await res.json();
        setBlocks(data.data);
      } catch (err) {
        console.error("Failed to fetch work blocks:", err);
      }
    };

    fetchBlocks();
  }, []);

  // 🔧 Correct scroll when blocks load
  useEffect(() => {
    if (blocks.length > 0 && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        const y =
          el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [blocks]);

  const renderBlock = (block: WorkBlock) => {
    if (block.type === "copy" && block.copy) {
      return (
        <div key={block.id} className="prose max-w-none mb-10">
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
          className={`mb-10 w-full rounded-lg shadow-lg ${
            block.layout === "media-wide" ? "max-w-5xl mx-auto" : ""
          }`}
        />
      ));
    }

    if (block.type === "image" && block.media?.length) {
      if (block.layout === "media-3-col") {
        return (
          <div
            key={block.id}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10"
          >
            {block.media.map((m, idx) => (
              <img
                key={`${block.id}-${idx}`}
                src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${m.directus_files_id.id}`}
                alt={m.directus_files_id.filename_download}
                className="w-full rounded-lg shadow-md"
              />
            ))}
          </div>
        );
      }
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

  // ✅ group blocks by category
  const groupedBlocks = blocks.reduce<Record<string, WorkBlock[]>>(
    (acc, block) => {
      const category = block.work_example_id?.category;
      if (!category) return acc;
      const slug = toKebabCase(category);
      if (!acc[slug]) acc[slug] = [];
      acc[slug].push(block);
      return acc;
    },
    {}
  );

  const renderSection = (slug: string, title: string) => {
    const items = groupedBlocks[slug] || [];
    return (
      <section className="mb-20">
        {/* Invisible anchor for scroll-to-hash */}
        <div id={slug} className="relative -top-24"></div>

        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {items.length > 0 ? (
          items.map((block) => renderBlock(block))
        ) : (
          <p className="text-gray-400 italic">[ More content coming soon ]</p>
        )}
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-10">Our Work</h1>

      {renderSection("vr-experiences", "VR Experiences")}
      {renderSection("interactive-games", "Interactive Games")}
      {renderSection("immersive-training", "Immersive Training")}
      {renderSection("ar-campaigns", "AR Campaigns")}
      {renderSection("webgl-webgpu", "WebGL / WebGPU")}
      {renderSection("instant-win-games", "Instant Win Games")}
    </div>
  );
};

export default Work;
