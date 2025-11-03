import { useState } from "react";

type Props = {
  query: string;
  setQuery: (v: string) => void;
};

const WorkSearchBar = ({ query, setQuery }: Props) => {
  const [hasTyped, setHasTyped] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() !== "") setHasTyped(true);
  };

  const handleFocus = () => {
    // 👇 if the user already typed something before, clear the bar when they click back in
    if (hasTyped && query.trim() !== "") {
      setQuery("");
      setHasTyped(false);
    }
  };

  return (
    <input
      id="search"
      name="search"
      type="text"
      placeholder="Search projects..."
      value={query}
      onChange={handleChange}
      onFocus={handleFocus}
      className="w-full md:w-80 lg:w-96 px-4 py-2 rounded 
                 bg-gray-800 text-white placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-pink-500"
    />
  );
};

export default WorkSearchBar;
