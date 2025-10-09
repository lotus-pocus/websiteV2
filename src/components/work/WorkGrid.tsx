// src/components/work/WorkGrid.tsx
import RelatedCard from "./RelatedCard";
import { toKebabCase } from "../../utils/strings";
import type { WorkExample } from "../../types/work";

/** Directus gallery can arrive either as [{ id }] (normalized in Work.tsx)
 *  or as [{ directus_files_id: { id } }] depending on relation config. */
type GalleryItem =
  | { id: string }
  | { directus_files_id: { id: string } };

type Props = {
  examples: WorkExample[];
  activeTag: string;
};

const WorkGrid = ({ examples, activeTag }: Props) => {
  // ✅ Filter examples based on active tag
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

  // ✅ Empty state
  if (!filtered || filtered.length === 0) {
    return (
      <div className="text-center text-gray-400 italic mb-20">
        No projects found.
      </div>
    );
  }

  // ✅ Render grid
  return (
    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 mb-20">

      {filtered.map((ex) => {
        // Safely coerce whatever we got from Directus into { id: string }[]
        const galleryItems = (ex.gallery ?? []) as unknown as GalleryItem[];
        const normalizedGallery = galleryItems
          .map((g) => ("id" in g ? g.id : g.directus_files_id.id))
          .filter((id): id is string => typeof id === "string" && id.length > 0)
          .map((id) => ({ id }));

        return (
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
            gallery={normalizedGallery} // ✅ typed & normalized
            hoverBg={ex.hover_background_color || "rgba(0,0,0,0.6)"}
            hoverTextColor={ex.hover_text_color || "#ffffff"}
            link={ex.slug ? `/work/${ex.slug}` : `/work/${ex.id}`}
          />
        );
      })}
    </div>
  );
};

export default WorkGrid;
