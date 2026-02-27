"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "../../lib/hooks/use-debounce";
import { Search } from "lucide-react";

interface SearchProps {
  placeholder: string;
  debounceDelay?: number;
  onSearch: (query: string) => void;
}

export default function SearchInput({
  placeholder,
  debounceDelay = 500,
  onSearch,
}: SearchProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, debounceDelay);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
  };

  return (
    <div className="flex flex-row items-center relative w-full">
      <Search className="absolute left-3 text-gray-400 w-5 h-5" />
      <input
        type="text"
        id="search"
        placeholder={placeholder}
        value={search}
        onChange={handleSearchChange}
        className="border border-gray-300 pl-10 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}
