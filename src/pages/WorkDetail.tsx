import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion"; // 👈 added
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

        // Fetch current project by slug
        const exRes = await fetch(
          `${base}/items/work_examples?filter[slug][_eq]=${slug}&fields=id,title,slug,tags.tags_id.*`
        );
        const exData = await exRes.json();
        const currentJob: WorkExample | null = exData.data?.[0] || null;
        setJob(currentJob);

        if (!currentJob?.id) return;

        // Fetch blocks linked to this job
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

  const renderBlock = (block: WorkBlock) => {
    // ---------- COPY BLOCK ----------
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

    // ---------- VIDEO BLOCK ----------
    if (block.type === "video" && block.media?.length) {
      const base = import.meta.env.VITE_DIRECTUS_URL as string;

      // multi-column layout
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
                  className="w-full shadow-lg object-contain cursor-pointer bg-black"
                />
              );
            })}
          </div>
        );
      }

      // ---------- Full-width single video (banner style) ----------
      return block.media.map((m, idx) => {
        const url = `${import.meta.env.VITE_DIRECTUS_URL}/assets/${m.directus_files_id.id}`;
        return (
          <div
            key={`${block.id}-${idx}`}
            className="w-screen flex justify-center bg-black mb-16"
            style={{
              marginLeft: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <video
              src={url}
              autoPlay
              loop
              muted
              playsInline
              onClick={() => setSelectedVideo(url)}
              className="max-h-[95vh] w-auto object-contain cursor-pointer"
              style={{
                display: "block",
              }}
            />
          </div>
        );
      });
    }

    // ---------- IMAGE BLOCK ----------
    if (block.type === "image" && block.media?.length) {
      // 3-column layout
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
                className="w-full h-auto shadow-md object-cover"
              />
            ))}
          </div>
        );
      }

      // single image
      return block.media.map((m, idx) => (
        <img
          key={`${block.id}-${idx}`}
          src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${m.directus_files_id.id}`}
          alt={m.directus_files_id.filename_download}
          className="mb-10 w-full shadow-md object-cover"
        />
      ));
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <Link to="/work" className="text-pink-400 underline mb-6 inline-block">
        ← Back to All Work
      </Link>

      {!job ? (
        <p className="text-gray-400">Project not found.</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8">{job.title}</h1>
          {blocks.map((block) => renderBlock(block))}

          {/* --- Animated Related Work heading (replays on project change + scroll re-entry) --- */}
          <motion.div
            key={slug} // 👈 ensures re-mounts when a new project loads
            className="overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }} // 👈 replays on scroll re-entry
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.06,
                  delayChildren: 0.2,
                },
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
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  style={{ display: "inline-block" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h2>
          </motion.div>

          {/* Related Work Section */}
          <RelatedWork
            currentId={job.id}
            tags={job.tags?.map((t) => t.tags_id) || []}
          />
        </>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          src={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default WorkDetail;
