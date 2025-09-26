// src/components/work/RelatedWork.tsx
import { useEffect, useState } from "react";
import RelatedCard from "./RelatedCard";
import { toKebabCase } from "../../utils/strings";

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
  tags?: { tags_id: Tag }[];
};

type Props = {
  currentId: number; // 👈 ID of the job currently being viewed
  tags: Tag[];       // 👈 Tags from the current job
};

const RelatedWork = ({ currentId, tags }: Props) => {
  const [related, setRelated] = useState<WorkExample[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!tags || tags.length === 0) return;

      const base = import.meta.env.VITE_DIRECTUS_URL as string;

      // Collect tag slugs for filter
      const tagSlugs = tags.map((t) => t.slug || toKebabCase(t.name));

      const query = encodeURIComponent(tagSlugs.join(","));
      const res = await fetch(
        `${base}/items/work_examples?filter[tags][tags_id][slug][_in]=${query}&fields=id,title,description,category,thumbnail.id,hover_video.id,hover_background_color,hover_text_color`
      );

      const data = await res.json();

      // Exclude the current job
      const filtered = (data.data || []).filter(
        (ex: WorkExample) => ex.id !== currentId
      );

      setRelated(filtered);
    };

    fetchRelated();
  }, [currentId, tags]);

  if (related.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="text-2xl font-bold mb-6">Related Work</h2>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((ex) => (
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
            link={
              ex.category ? `/work/${toKebabCase(ex.category)}` : "/work"
            }
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedWork;
