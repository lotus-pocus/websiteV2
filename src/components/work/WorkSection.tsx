// src/components/work/WorkSections.tsx
import parse from "html-react-parser";
import type { WorkBlock, DirectusFile } from "../../types/work";

const toKebabCase = (str?: string) =>
  str ? str.toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-") : "";

const WorkSections = ({ blocks }: { blocks: WorkBlock[] }) => {
  // group blocks by category
  const grouped = blocks.reduce<Record<string, WorkBlock[]>>((acc, block) => {
    const category = block.work_example_id?.category;
    if (!category) return acc;
    const slug = toKebabCase(category);
    if (!acc[slug]) acc[slug] = [];
    acc[slug].push(block);
    return acc;
  }, {});

  const renderBlock = (block: WorkBlock) => {
    if (block.type === "copy" && block.copy) {
      return (
        <div key={block.id} className="prose max-w-none mb-10">
          {parse(block.copy)}
        </div>
      );
    }

    if (block.type === "video" && block.media?.length) {
      return block.media.map(
        (m: { directus_files_id: DirectusFile }, idx: number) => (
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
        )
      );
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
            {block.media.map(
              (m: { directus_files_id: DirectusFile }, idx: number) => {
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
              }
            )}
          </div>
        );
      }

      return block.media.map(
        (m: { directus_files_id: DirectusFile }, idx: number) => {
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
        }
      );
    }
    return null;
  };

  const renderSection = (slug: string, title: string) => {
    const items = grouped[slug] || [];
    return (
      <section className="mb-20" key={slug}>
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
    <>
      {renderSection("vr-experiences", "VR Experiences")}
      {renderSection("interactive-games", "Interactive Games")}
      {renderSection("immersive-training", "Immersive Training")}
      {renderSection("ar-campaigns", "AR Campaigns")}
      {renderSection("webgl-webgpu", "WebGL / WebGPU")}
      {renderSection("cgi-motion-graphics-video-editing", "CGI, Motion Graphics & Video Editing")}
    </>
  );
};

export default WorkSections;
