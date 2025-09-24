// src/pages/WorkOverview.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import RelatedCard from "../components/RelatedCard";
import { services } from "../components/data/services";

// ✅ Slug helper to clean up titles like "WebGL / WebGPU"
const toSlug = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric & symbols (like "/")
    .replace(/\s+/g, "-")         // spaces → dash
    .replace(/-+/g, "-");         // collapse multiple dashes

const WorkOverview = () => {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Collect unique categories from services
  const tags = services.map((srv) => srv.title);

  // Apply both tag + text search
  const filtered = services.filter((srv) => {
    const matchesQuery = srv.title
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesTag = !activeTag || srv.title === activeTag;
    return matchesQuery && matchesTag;
  });

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">Our Work</h1>

      {/* 🔍 Search bar */}
      <input
        type="text"
        placeholder="Search by keyword..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 mb-6 text-black rounded-md"
      />

      {/* 🏷️ Tag filter bar */}
      <div className="flex flex-wrap gap-3 mb-10">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-4 py-2 rounded-full border ${
            activeTag === null
              ? "bg-white text-black"
              : "bg-transparent text-white"
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-full border ${
              activeTag === tag
                ? "bg-white text-black"
                : "bg-transparent text-white"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid of services */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((srv) => {
          const slug = toSlug(srv.title);
          return (
            <Link key={slug} to={`/work/${slug}`}>
              <RelatedCard
                title={srv.title}
                description={srv.description}
                thumbnail={srv.image}
                hoverVideo={srv.video}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default WorkOverview;
