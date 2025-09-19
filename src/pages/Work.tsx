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
    id?: number;
    title?: string;
    category?: string;
    tags?: { tags_id: Tag }[]; // ✅ comes from junction table
  };
};

// ✅ normalize string safely → kebab-case lowercase
const toKebabCase = (str?: string) =>
  str ? str.toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-") : "";

const HEADER_OFFSET = 100; // matches ScrollToHash.tsx

const Work = () => {
  const [blocks, setBlocks] = useState<WorkBlock[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [activeTag, setActiveTag] = useState<string>("all");

  // Fetch blocks + tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;

        // ✅ Expand tags through junction (tags_id.*)
        const blocksRes = await fetch(
          `${base}/items/work_blocks?fields=id,type,copy,layout,media.directus_files_id.*,work_example_id.id,work_example_id.title,work_example_id.category,work_example_id.tags.tags_id.*`
        );
        const blocksData = await blocksRes.json();
        console.log("[DEBUG] Blocks with tags:", blocksData.data);
        setBlocks(Array.isArray(blocksData.data) ? blocksData.data : []);

        // ✅ Fetch all tags for filter bar
        const tagsRes = await fetch(`${base}/items/tags?fields=id,name,slug`);
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setAllTags(Array.isArray(tagsData.data) ? tagsData.data : []);
        } else {
          setAllTags([]);
        }
      } catch (err) {
        console.error("Failed to fetch work data:", err);
        setAllTags([]);
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

  // ✅ group blocks by category (default mode)
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

  // ✅ get blocks filtered by active tag
  const taggedBlocks = blocks.filter((block) => {
    const tags = block.work_example_id?.tags
      ?.map(
        (t) =>
          (t.tags_id?.slug || toKebabCase(t.tags_id?.name)).toLowerCase()
      )
      .filter(Boolean);
    if (activeTag === "all") return true;
    return tags?.includes(activeTag.toLowerCase());
  });

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

      {/* 🔹 Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-10">
        <button
          onClick={() => setActiveTag("all")}
          className={`px-4 py-2 rounded-full border ${
            activeTag === "all"
              ? "bg-white text-black"
              : "bg-transparent text-white border-white"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => {
          const tagSlug = (tag.slug || toKebabCase(tag.name)).toLowerCase();
          return (
            <button
              key={tag.id}
              onClick={() => setActiveTag(tagSlug)}
              className={`px-4 py-2 rounded-full border ${
                activeTag === tagSlug
                  ? "bg-white text-black"
                  : "bg-transparent text-white border-white"
              }`}
            >
              {tag.name}
            </button>
          );
        })}
      </div>

      {activeTag === "all" ? (
        <>
          {renderSection("vr-experiences", "VR Experiences")}
          {renderSection("interactive-games", "Interactive Games")}
          {renderSection("immersive-training", "Immersive Training")}
          {renderSection("ar-campaigns", "AR Campaigns")}
          {renderSection("webgl-webgpu", "WebGL / WebGPU")}
          {renderSection("instant-win-games", "Instant Win Games")}
        </>
      ) : (
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">
            Results for “
            {allTags.find(
              (t) =>
                (t.slug || toKebabCase(t.name)).toLowerCase() ===
                activeTag.toLowerCase()
            )?.name || activeTag}
            ”
          </h2>
          {taggedBlocks.length > 0 ? (
            taggedBlocks.map((block) => (
              <div key={block.id} className="mb-10">
                <h3 className="text-xl font-semibold mb-2">
                  {block.work_example_id?.title}
                </h3>
                {renderBlock(block)}
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic">No projects found.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default Work;
