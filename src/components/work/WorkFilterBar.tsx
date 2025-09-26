import { toKebabCase } from "../../utils/strings"; // or define here
import type { Tag } from "../../types/work";

type Props = {
  allTags: Tag[];
  activeTag: string;
  setActiveTag: (tag: string) => void;
};

const WorkFilterBar = ({ allTags, activeTag, setActiveTag }: Props) => (
  <div className="flex flex-wrap gap-3 mb-10">
    <button
      onClick={() => setActiveTag("all")}
      className={`px-4 py-2 rounded-full border ${
        activeTag === "all"
          ? "bg-white text-black"
          : "bg-transparent text-white border-white"
      }`}
    >
      All
    </button>
    {allTags.map((tag) => {
      const tagSlug = (tag.slug || toKebabCase(tag.name)).toLowerCase();
      return (
        <button
          key={tag.id}
          onClick={() => setActiveTag(tagSlug)}
          className={`px-4 py-2 rounded-full border ${
            activeTag === tagSlug
              ? "bg-white text-black"
              : "bg-transparent text-white border-white"
          }`}
        >
          {tag.name}
        </button>
      );
    })}
  </div>
);

export default WorkFilterBar;
