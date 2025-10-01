type Props = {
  query: string;
  setQuery: (v: string) => void;
};

const WorkSearchBar = ({ query, setQuery }: Props) => (
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
);

export default WorkSearchBar;
