import { toKebabCase } from "../../utils/strings";
import type { Tag } from "../../types/work";

type Props = {
  allTags: Tag[];
  activeTag: string;
  setActiveTag: (tag: string) => void;
};

const WorkFilterBar = ({ allTags, activeTag, setActiveTag }: Props) => (
  <div className="flex flex-wrap gap-3 mb-10">
    {/* "All" button */}
    <button
      onClick={() => setActiveTag("all")}
      className={`px-4 py-2 rounded-full border transition-all duration-300
        ${
          activeTag === "all"
            ? "bg-white text-black border-white"
            : "bg-transparent text-white border-white hover:bg-[#ff00aa] hover:text-black hover:border-[#ff00aa]"
        }`}
    >
      All
    </button>

    {/* Tag buttons */}
    {allTags.map((tag) => {
      const tagSlug = (tag.slug || toKebabCase(tag.name)).toLowerCase();
      const isActive = activeTag === tagSlug;

      return (
        <button
          key={tag.id}
          onClick={() => setActiveTag(tagSlug)}
          className={`px-4 py-2 rounded-full border transition-all duration-300
            ${
              isActive
                ? "bg-white text-black border-white"
                : "bg-transparent text-white border-white hover:bg-[#ff00aa] hover:text-black hover:border-[#ff00aa]"
            }`}
        >
          {tag.name}
        </button>
      );
    })}
  </div>
);

export default WorkFilterBar;
