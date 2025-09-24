import { useEffect, useState } from "react";
import parse from "html-react-parser";
import RelatedCard from "../components/RelatedCard";

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

type WorkExample = {
  id: number;
  title: string;
  description?: string;
  category?: string;
  thumbnail?: { id: string };
  hover_video?: { id: string };
  hover_background_color?: string;
  hover_text_color?: string;
};

type WorkBlock = {
  id: number;
  type: "copy" | "video" | "image";
  copy?: string;
  layout?: string;
  media?: { directus_files_id: DirectusFile }[];
  work_example_id?: {
    id?: number;
    title?: string;
    category?: string;
    tags?: { tags_id: Tag }[];
  };
};

// ✅ normalize string safely → kebab-case lowercase
const toKebabCase = (str?: string) =>
  str ? str.toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-") : "";

const HEADER_OFFSET = 100; // matches ScrollToHash.tsx

const Work = () => {
  const [blocks, setBlocks] = useState<WorkBlock[]>([]);
  const [examples, setExamples] = useState<WorkExample[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [activeTag, setActiveTag] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;

        // ✅ Fetch examples (thumbnails + hover info)
        const exRes = await fetch(
          `${base}/items/work_examples?fields=id,title,description,category,thumbnail.id,hover_video.id,hover_background_color,hover_text_color`
        );
        const exData = await exRes.json();
        setExamples(Array.isArray(exData.data) ? exData.data : []);

        // ✅ Fetch blocks with tags
        const blocksRes = await fetch(
          `${base}/items/work_blocks?fields=id,type,copy,layout,media.directus_files_id.*,work_example_id.id,work_example_id.title,work_example_id.category,work_example_id.tags.tags_id.*`
        );
        const blocksData = await blocksRes.json();
        setBlocks(Array.isArray(blocksData.data) ? blocksData.data : []);

        // ✅ Fetch all tags for filter bar
        const tagsRes = await fetch(`${base}/items/tags?fields=id,name,slug`);
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setAllTags(Array.isArray(tagsData.data) ? tagsData.data : []);
        }
      } catch (err) {
        console.error("Failed to fetch work data:", err);
      }
    };

    fetchData();
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

    if (
      (block.type === "image" || block.type === "video") &&
      block.media?.length
    ) {
      if (block.layout === "media-3-col") {
        return (
          <div
            key={block.id}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10"
          >
            {block.media.map((m, idx) => {
              const file = m.directus_files_id;
              const isVideo = file.type?.startsWith("video");

              return isVideo ? (
                <video
                  key={`${block.id}-${idx}`}
                  src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${file.id}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full rounded-lg shadow-md"
                />
              ) : (
                <img
                  key={`${block.id}-${idx}`}
                  src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${file.id}`}
                  alt={file.filename_download}
                  className="w-full rounded-lg shadow-md"
                />
              );
            })}
          </div>
        );
      }

      return block.media.map((m, idx) => {
        const file = m.directus_files_id;
        const isVideo = file.type?.startsWith("video");

        return isVideo ? (
          <video
            key={`${block.id}-${idx}`}
            src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${file.id}`}
            autoPlay
            loop
            muted
            playsInline
            className="mb-10 w-full rounded-lg shadow-md"
          />
        ) : (
          <img
            key={`${block.id}-${idx}`}
            src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${file.id}`}
            alt={file.filename_download}
            className="mb-10 w-full rounded-lg shadow-md"
          />
        );
      });
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

  // ✅ render a section of blocks
  const renderSection = (slug: string, title: string) => {
    const items = groupedBlocks[slug] || [];
    return (
      <section className="mb-20">
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

      {/* 🔹 Thumbnails Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-20">
        {examples.map((ex) => (
          <RelatedCard
            key={ex.id}
            title={ex.title}
            description={ex.description}
            thumbnail={
              ex.thumbnail
                ? `${import.meta.env.VITE_DIRECTUS_URL}/assets/${ex.thumbnail.id}`
                : ""
            }
            hoverVideo={
              ex.hover_video
                ? `${import.meta.env.VITE_DIRECTUS_URL}/assets/${ex.hover_video.id}`
                : undefined
            }
            hoverBg={ex.hover_background_color || "rgba(0,0,0,0.6)"}
            hoverTextColor={ex.hover_text_color || "#ffffff"}
            link={`/work/${ex.id}`}
          />
        ))}
      </div>

      {/* 🔹 Existing blocks grouped by category */}
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
