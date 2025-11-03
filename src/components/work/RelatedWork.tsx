// src/components/work/RelatedWork.tsx
import { useEffect, useState } from "react";
import RelatedCard from "./RelatedCard";
import type { WorkExample, Tag } from "../../types/work";

type Props = {
  currentId: number | null;
  tags?: Tag[] | null;
};

const RelatedWork = ({ currentId, tags }: Props) => {
  const [related, setRelated] = useState<WorkExample[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;

        // ✅ Guard: don’t run if no current project or no tags
        if (!currentId || !tags || tags.length === 0) return;

        const tagIds = tags
          .filter((t) => t && t.id)
          .map((t) => t.id)
          .join(",");

        if (!tagIds) return;

        const url =
          `${base}/items/work_examples` +
          `?fields=id,title,slug,description,category,thumbnail.id,hover_video.id,hover_background_color,hover_text_color,tags.tags_id.*` +
          `&filter[tags][tags_id][id][_in]=${tagIds}`;

        const res = await fetch(url);
        const data = await res.json();

        // ✅ Guard against null or malformed data
        if (!data || !Array.isArray(data.data)) {
          console.warn("No valid related data returned from Directus");
          return;
        }

        // Exclude the current project
        const filtered = data.data.filter(
          (ex: WorkExample) => ex && ex.id !== currentId
        );

        setRelated(filtered);
      } catch (err) {
        console.error("Failed to fetch related work:", err);
      }
    };

    fetchRelated();
  }, [currentId, JSON.stringify(tags)]);

  if (!related || related.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-6">Related Work</h3>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((ex) => (
          <RelatedCard
            key={ex.id}
            title={ex.title || "[Untitled Project]"}
            description={ex.description || ""}
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
            link={ex.slug ? `/work/${ex.slug}` : `/work/${ex.id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedWork;
