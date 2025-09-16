import { useEffect, useState } from "react";
import parse from "html-react-parser"; // 👈 for rendering WYSIWYG HTML

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
};

const Work = () => {
  const [blocks, setBlocks] = useState<WorkBlock[]>([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const res = await fetch(
          `${base}/items/work_blocks?fields=id,type,copy,layout,media.directus_files_id.*`
        );
        const data = await res.json();
        console.log("Fetched blocks:", data.data);
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
        <div key={block.id} className="prose max-w-none mb-10">
          {parse(block.copy)} {/* 👈 now renders <h2>, <p>, <ul> properly */}
        </div>
      );
    }

    if (block.type === "video" && block.media?.length) {
      return block.media.map((m, idx) => (
        <video
          key={`${block.id}-${idx}`}
          src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${m.directus_files_id.id}`}
          controls
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

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-10">Our Work</h1>

      <section id="vr-experiences" className="mb-20">
        <h2 className="text-2xl font-bold mb-4">VR Experiences</h2>
        {blocks.map((block) => renderBlock(block))}
      </section>

      <section id="interactive-games" className="mb-20">
        <h2 className="text-2xl font-bold mb-4">Interactive Games</h2>
        <p>Examples of interactive games will appear here.</p>
      </section>

      <section id="immersive-training" className="mb-20">
        <h2 className="text-2xl font-bold mb-4">Immersive Training</h2>
        <p>Examples of immersive training will appear here.</p>
      </section>

      <section id="webgl-webgpu" className="mb-20">
        <h2 className="text-2xl font-bold mb-4">WebGL / WebGPU</h2>
        <p>Examples of WebGL / WebGPU projects will appear here.</p>
      </section>

      <section id="ar-campaigns" className="mb-20">
        <h2 className="text-2xl font-bold mb-4">AR Campaigns</h2>
        <p>Examples of AR campaigns will appear here.</p>
      </section>

      <section id="instant-win-games" className="mb-20">
        <h2 className="text-2xl font-bold mb-4">Instant Win Games</h2>
        <p>Examples of instant win games will appear here.</p>
      </section>
    </div>
  );
};

export default Work;
