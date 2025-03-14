// components/SortSelector.tsx
"use client";

interface SortSelectorProps {
  onSortChange: (sortOption: string) => void;
  currentSort: string;
}

export default function SortSelector({
  onSortChange,
  currentSort,
}: SortSelectorProps) {
  return (
    <div className="flex items-center mb-4">
      <label
        htmlFor="sort-by"
        className="mr-2 text-sm font-medium text-gray-700"
      >
        Sort by:
      </label>
      <select
        id="sort-by"
        className="border border-gray-300 rounded-md shadow-sm py-1 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="hoursAsc">Hours (Low to High)</option>
        <option value="hoursDesc">Hours (High to Low)</option>
        <option value="alphabetical">A-Z</option>
      </select>
    </div>
  );
}
