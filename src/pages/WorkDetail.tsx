// src/pages/WorkDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  work_example_id?: { id?: number; category?: string };
};

type WorkExample = {
  id: number;
  title: string;
  category?: string;
  tags?: { tags_id: Tag }[];
};

const WorkDetail = () => {
  const { category } = useParams<{ category: string }>();
  const [blocks, setBlocks] = useState<WorkBlock[]>([]);
  const [job, setJob] = useState<WorkExample | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;

        // 1. Fetch current project
        const exRes = await fetch(
          `${base}/items/work_examples?filter[category][_eq]=${category}&fields=id,title,category,tags.tags_id.*`
        );
        const exData = await exRes.json();
        const currentJob = exData.data?.[0];
        setJob(currentJob);

        // 2. Fetch blocks for this category
        const blocksRes = await fetch(
          `${base}/items/work_blocks?fields=id,type,copy,layout,media.directus_files_id.*,work_example_id.id,work_example_id.category`
        );
        const blocksData = await blocksRes.json();

        // only keep blocks for this project’s category
        const filtered = (blocksData.data || []).filter(
          (b: WorkBlock) => b.work_example_id?.category === category
        );

        setBlocks(filtered);

        console.log("WorkDetail category:", category);
        console.log("WorkDetail job:", currentJob);
        console.log("WorkDetail blocks:", filtered);
      } catch (err) {
        console.error("Failed to fetch work detail data:", err);
      }
    };

    fetchData();
  }, [category]);

  const renderBlock = (block: WorkBlock) => {
    // Copy block
    if (block.type === "copy" && block.copy) {
      return (
        <div key={block.id} className="prose max-w-none mb-10 text-white">
          {parse(block.copy)}
        </div>
      );
    }

    // Video block(s)
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

    // Image block(s)
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

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <Link to="/work" className="text-pink-400 underline mb-6 inline-block">
        ← Back to All Work
      </Link>

      <h1 className="text-3xl font-bold mb-8">
        {job?.title || category?.replace(/-/g, " ")}
      </h1>

      {blocks.map((block) => renderBlock(block))}

      {/* Related Work */}
      {job && (
        <RelatedWork
          currentId={job.id}
          tags={job.tags?.map((t) => t.tags_id) || []}
        />
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal src={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
};

export default WorkDetail;
