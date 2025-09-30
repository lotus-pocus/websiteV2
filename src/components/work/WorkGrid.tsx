// src/components/work/WorkGrid.tsx
import ServiceCard from "../ServiceCard"; // 👈 use ServiceCard instead of RelatedCard
import { toKebabCase } from "../../utils/strings";
import type { WorkExample } from "../../types/work";

type Props = {
  examples: WorkExample[];
  activeTag: string;
  onSelect?: (example: WorkExample) => void;
};

const WorkGrid = ({ examples, activeTag }: Props) => {
  console.log("[DEBUG] WorkGrid received examples:", examples);
  console.log("[DEBUG] Active tag:", activeTag);

  const filtered =
    activeTag === "all"
      ? examples
      : examples.filter((ex) =>
          ex.tags?.some(
            (t) =>
              (t.tags_id?.slug || toKebabCase(t.tags_id?.name))?.toLowerCase() ===
              activeTag.toLowerCase()
          )
        );

  console.log("[DEBUG] WorkGrid filtered examples:", filtered);

  if (!filtered || filtered.length === 0) {
    return (
      <div className="text-center text-gray-400 italic mb-20">
        No projects found.
      </div>
    );
  }

  return (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-20">
      {filtered.map((ex) => (
        <ServiceCard
          key={ex.id}
          title={ex.title || "[Untitled Project]"}
          description={ex.description || ""}
          image={
            ex.thumbnail
              ? `${import.meta.env.VITE_DIRECTUS_URL}/assets/${ex.thumbnail.id}`
              : ""
          }
          video={
            ex.hover_video
              ? `${import.meta.env.VITE_DIRECTUS_URL}/assets/${ex.hover_video.id}`
              : undefined
          }
          // ✅ pass slug-based link
          link={ex.slug ? `/work/${ex.slug}` : `/work/${ex.id}`}
        />
      ))}
    </div>
  );
};

export default WorkGrid;
