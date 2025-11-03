import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import VideoModal from "../components/VideoModal";
import RelatedWork from "../components/work/RelatedWork";

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
  work_example_id?: { id?: number; slug?: string; title?: string };
};

type WorkExample = {
  id: number;
  title: string;
  slug: string;
  tags?: { tags_id: Tag }[];
};

const WorkDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blocks, setBlocks] = useState<WorkBlock[]>([]);
  const [job, setJob] = useState<WorkExample | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchData = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;

        const exRes = await fetch(
          `${base}/items/work_examples?filter[slug][_eq]=${slug}&fields=id,title,slug,tags.tags_id.*`
        );
        const exData = await exRes.json();
        const currentJob: WorkExample | null = exData.data?.[0] || null;
        setJob(currentJob);

        if (!currentJob?.id) return;

        const blocksRes = await fetch(
          `${base}/items/work_blocks?filter[work_example_id][_eq]=${currentJob.id}&fields=id,type,copy,layout,media.directus_files_id.*,work_example_id.id,work_example_id.slug,work_example_id.title`
        );
        const blocksData = await blocksRes.json();
        setBlocks(blocksData.data || []);
      } catch (err) {
        console.error("Failed to fetch work detail data:", err);
      }
    };

    fetchData();
  }, [slug]);

  /* ---------- Render helpers ---------- */
  const renderBlock = (block: WorkBlock) => {
    if (block.type === "copy" && block.copy) {
      return (
        <div
          key={block.id}
          className="max-w-6xl mx-auto px-10 pt-10 pb-12 prose prose-lg prose-invert"
        >
          {parse(block.copy)}
        </div>
      );
    }

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
                  onClick={() => setSelectedVideo(url)}
                  className="w-full object-contain cursor-pointer bg-black pointer-events-auto"
                  style={{ isolation: "auto" }} // ✅ prevent blocking blends
                />
              );
            })}
          </div>
        );
      }

      return block.media.map((m, idx) => {
        const url = `${base}/assets/${m.directus_files_id.id}`;
        return (
          <div
            key={`${block.id}-${idx}`}
            className="w-screen flex justify-center mb-16"
            style={{
              marginLeft: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none",
              isolation: "auto", // ✅ allow blending
            }}
          >
            <video
              src={url}
              autoPlay
              loop
              muted
              playsInline
              className="max-h-[95vh] w-auto object-contain"
              style={{ pointerEvents: "none" }}
            />
          </div>
        );
      });
    }

    if (block.type === "image" && block.media?.length) {
      return block.media.map((m, idx) => (
        <img
          key={`${block.id}-${idx}`}
          src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${m.directus_files_id.id}`}
          alt={m.directus_files_id.filename_download}
          className="mb-10 w-full shadow-md object-cover pointer-events-none"
          style={{ isolation: "auto" }}
        />
      ));
    }

    return null;
  };

  /* ---------- Page render ---------- */
  return (
    <div
      className="min-h-screen text-white p-10 relative"
      style={{ backgroundColor: "rgba(0,0,0,0.98)", isolation: "auto" }} // ✅ transparent black + no isolation
    >
      <div className="absolute inset-0 pointer-events-none" />

      <Link
        to="/work"
        className="text-pink-400 underline mb-6 inline-block hover:text-pink-300"
      >
        ← Back to All Work
      </Link>

      {!job ? (
        <p className="text-gray-400">Project not found.</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8">{job.title}</h1>

          {blocks.map((block) => renderBlock(block))}

          <motion.div
            key={slug}
            className="overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.06, delayChildren: 0.2 },
              },
            }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-14 tracking-tight text-pink-400">
              {"related work.".split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ display: "inline-block" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h2>
          </motion.div>

          <RelatedWork
            currentId={job.id}
            tags={job.tags?.map((t) => t.tags_id) || []}
          />
        </>
      )}

      {selectedVideo && (
        <VideoModal src={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
};

export default WorkDetail;
