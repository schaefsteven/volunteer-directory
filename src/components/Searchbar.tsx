// components/SearchBar.tsx
"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function SearchBar({
  onSearch,
  initialQuery = "",
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="mb-6">
      <div className="flex rounded-md shadow-sm">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search by title, organization, or keyword"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
    </form>
  );
}
