type Props = {
  allTags: (string | undefined)[];
  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;
};

const WorkTagFilter = ({ allTags, activeTag, setActiveTag }: Props) => (
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
    {allTags.map(
      (tag) =>
        tag && (
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
        )
    )}
  </div>
);

export default WorkTagFilter;
