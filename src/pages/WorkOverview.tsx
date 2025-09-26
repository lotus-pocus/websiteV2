// src/pages/WorkOverview.tsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import RelatedCard from "../components/work/RelatedCard";

type DirectusFile = {
  id: string;
};

type Tag = {
  id: number;
  name: string;
  slug?: string;
};

type WorkExample = {
  id: number;
  title: string;
  description: string;
  category?: string | null;
  thumbnail?: DirectusFile;
  hover_video?: DirectusFile;
  tags?: { tags_id: Tag }[];
};

const toSlug = (str?: string | null) =>
  (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const WorkOverview = () => {
  const [examples, setExamples] = useState<WorkExample[]>([]);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const token = import.meta.env.VITE_DIRECTUS_TOKEN as string | undefined;

        const url =
          `${base}/items/work_examples` +
          `?fields=id,title,description,category,thumbnail.id,hover_video.id,tags.tags_id.*` +
          `&sort=-date_created`;

        const headers: Record<string, string> = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const res = await fetch(url, { headers });
        const data = await res.json();
        setExamples(data.data || []);
      } catch (err) {
        console.error("Failed to load work_examples", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const ex of examples) {
      ex.tags?.forEach((j) => j.tags_id?.name && s.add(j.tags_id.name));
    }
    return [...s].sort();
  }, [examples]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return examples.filter((ex) => {
      const textHit =
        ex.title.toLowerCase().includes(q) ||
        ex.description.toLowerCase().includes(q) ||
        (ex.tags || []).some((j) =>
          j.tags_id?.name.toLowerCase().includes(q)
        );
      const tagHit =
        !activeTag ||
        (ex.tags || []).some((j) => j.tags_id?.name === activeTag);
      return textHit && tagHit;
    });
  }, [examples, query, activeTag]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">Our Work</h1>

      {/* 🔍 Search */}
      <input
        id="search"
        name="search"
        type="text"
        placeholder="Search by keyword..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 mb-6 rounded-md 
                   border border-white 
                   text-white placeholder-white 
                   bg-transparent"
      />

      {/* 🏷️ Tag filter */}
      <div className="flex flex-wrap gap-3 mb-10">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-4 py-2 rounded-full border ${
            activeTag === null
              ? "bg-white text-black"
              : "bg-transparent text-white border-white"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-full border ${
              activeTag === tag
                ? "bg-white text-black"
                : "bg-transparent text-white border-white"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((ex) => {
          const base = import.meta.env.VITE_DIRECTUS_URL as string;
          const thumb = ex.thumbnail?.id
            ? `${base}/assets/${ex.thumbnail.id}`
            : "";
          const hover = ex.hover_video?.id
            ? `${base}/assets/${ex.hover_video.id}`
            : undefined;

          return (
            <Link
              key={ex.id}
              to={
                ex.category ? `/work/${toSlug(ex.category)}` : "/work"
              }
            >
              <RelatedCard
                title={ex.title}
                description={ex.description}
                thumbnail={thumb}
                hoverVideo={hover}
              />
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 text-neutral-400">
          No results. Try another search.
        </div>
      )}
    </div>
  );
};

export default WorkOverview;
