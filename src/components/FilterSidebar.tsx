// components/FilterSidebar.tsx
"use client";

import { useState } from "react";

export default function FilterSidebar() {
  const [filters, setFilters] = useState({
    commitment: "",
    format: "",
    location: "",
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleApplyFilters = () => {
    // In a real app, you would trigger a search/filter here
    console.log("Applying filters:", filters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="commitment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Time Commitment
          </label>
          <select
            id="commitment"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.commitment}
            onChange={(e) => handleFilterChange("commitment", e.target.value)}
          >
            <option value="">Any</option>
            <option value="1-5">1-5 hours/week</option>
            <option value="5-10">5-10 hours/week</option>
            <option value="10-20">10-20 hours/week</option>
            <option value="20+">20+ hours/week</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="format"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Format
          </label>
          <select
            id="format"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.format}
            onChange={(e) => handleFilterChange("format", e.target.value)}
          >
            <option value="">Any</option>
            <option value="remote">Remote</option>
            <option value="in-person">In-Person</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            placeholder="City, State or Zip Code"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          />
        </div>

        <button
          type="button"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
