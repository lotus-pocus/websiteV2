import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import WorkFilterBar from "../components/work/WorkFilterBar";
import WorkGrid from "../components/work/WorkGrid";
import WorkSearchBar from "../components/work/WorkSearchBar";
import type { WorkExample, Tag } from "../types/work";

/* ---------- Directus Response Types ---------- */
type DirectusResponse<T> = {
  data: T;
};

const Work = () => {
  const [examples, setExamples] = useState<WorkExample[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [activeTag, setActiveTag] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  /* ---------- Fetch Data ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;

        // ✅ Fetch Work Examples (with related work_blocks.copy)
        const exRes = await fetch(
          `${base}/items/work_examples?fields=id,title,slug,description,category,thumbnail.id,hover_video.id,hover_background_color,hover_text_color,tags.tags_id.*,work_blocks.copy`
        );
        const exData: DirectusResponse<WorkExample[]> = await exRes.json();
        setExamples(Array.isArray(exData.data) ? exData.data : []);

        // ✅ Fetch Tags (typed)
        const tagsRes = await fetch(`${base}/items/tags?fields=id,name,slug`);
        const tagsData: DirectusResponse<Tag[]> = await tagsRes.json();
        setAllTags(Array.isArray(tagsData.data) ? tagsData.data : []);
      } catch (err) {
        console.error("Failed to fetch work data:", err);
      }
    };

    fetchData();
  }, []);

  /* ---------- Combined Filtering ---------- */
  const filteredExamples = examples.filter((ex: any) => {
    const term = searchTerm.toLowerCase().trim();
    const tagActive = activeTag !== "all";

    // ✅ Safely normalize and flatten description
    const plainDescription = ex.description
      ? ex.description
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;|&#160;/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase()
      : "";

    // ✅ Combine all work_blocks copy into one searchable string
    const allBlockCopy = Array.isArray(ex.work_blocks)
      ? ex.work_blocks.map((b: any) => b.copy || "").join(" ")
      : "";
    const plainBlockCopy = allBlockCopy
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;|&#160;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    // ✅ Matches
    const titleMatch = ex.title?.toLowerCase().includes(term);
    const descMatch = plainDescription.includes(term);
    const blockMatch = plainBlockCopy.includes(term);
    const tagMatch = ex.tags?.some((t: any) =>
      t.tags_id?.name?.toLowerCase().includes(term)
    );

    // 1️⃣ If searching by text
    if (term) return titleMatch || descMatch || blockMatch || tagMatch;

    // 2️⃣ Otherwise filter by tag
    if (tagActive) {
      return ex.tags?.some(
        (t: any) =>
          (t.tags_id?.slug || t.tags_id?.name?.toLowerCase()) ===
          activeTag.toLowerCase()
      );
    }

    // 3️⃣ Default — show all
    return true;
  });

  /* ---------- Render ---------- */
  return (
    <Layout>
      {/* 👇 Add data-theme="dark" so Layout detects black background */}
      <section
        data-theme="dark"
        className="min-h-screen bg-black text-white p-6 md:p-10"
      >
        {/* ✅ Title + Search inline, responsive */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 pr-16">
          <h1 className="text-3xl md:text-4xl font-bold">our work.</h1>

          {/* 🔍 Modular search bar */}
          <WorkSearchBar query={searchTerm} setQuery={setSearchTerm} />
        </div>

        {/* ✅ Tag Filter — clears search when tag clicked */}
        <WorkFilterBar
          allTags={allTags}
          activeTag={activeTag}
          setActiveTag={(tag) => {
            setActiveTag(tag);
            setSearchTerm(""); // 👈 clears search when tag selected
          }}
        />

        {/* ✅ Grid (search + tag combined) */}
        <WorkGrid examples={filteredExamples} activeTag={activeTag} />
      </section>
    </Layout>
  );
};

export default Work;
