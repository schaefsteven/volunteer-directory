// components/FilterSidebar.tsx
"use client";

import { useState } from "react";

// Define the filter state interface
interface FilterState {
  commitment: string;
  format: string;
  location: string;
  radius: string;
  schedule: string[];
  frequency: string[];
  categories: string[];
  skills: string[];
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  // Initialize state with explicit typing
  const [filters, setFilters] = useState<FilterState>({
    commitment: "",
    format: "",
    location: "",
    radius: "10",
    schedule: [],
    frequency: [],
    categories: [],
    skills: [],
  });

  // Handle text input changes
  const handleTextChange = (field: keyof FilterState, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  // Handle checkbox changes for array fields
  const handleCheckboxChange = (field: keyof FilterState, value: string) => {
    // Make sure we're only handling array fields
    if (
      field === "schedule" ||
      field === "frequency" ||
      field === "categories" ||
      field === "skills"
    ) {
      const currentValues = filters[field] as string[];
      let newValues: string[];

      if (currentValues.includes(value)) {
        // Remove the value if it already exists
        newValues = currentValues.filter((v) => v !== value);
      } else {
        // Add the value if it doesn't exist
        newValues = [...currentValues, value];
      }

      setFilters({ ...filters, [field]: newValues });
    }
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
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
            onChange={(e) => handleTextChange("commitment", e.target.value)}
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
            onChange={(e) => handleTextChange("format", e.target.value)}
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
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <input
                type="text"
                id="location"
                placeholder="Zip Code"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.location}
                onChange={(e) => handleTextChange("location", e.target.value)}
              />
            </div>
            <div>
              <select
                id="radius"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filters.radius}
                onChange={(e) => handleTextChange("radius", e.target.value)}
              >
                <option value="5">5 mi</option>
                <option value="10">10 mi</option>
                <option value="25">25 mi</option>
                <option value="50">50 mi</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <p className="block text-sm font-medium text-gray-700 mb-1">
            Schedule
          </p>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="scheduled"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={filters.schedule.includes("scheduled")}
                onChange={() => handleCheckboxChange("schedule", "scheduled")}
              />
              <label
                htmlFor="scheduled"
                className="ml-2 block text-sm text-gray-700"
              >
                Scheduled
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="flexible"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={filters.schedule.includes("flexible")}
                onChange={() => handleCheckboxChange("schedule", "flexible")}
              />
              <label
                htmlFor="flexible"
                className="ml-2 block text-sm text-gray-700"
              >
                Flexible
              </label>
            </div>
          </div>
        </div>

        <div>
          <p className="block text-sm font-medium text-gray-700 mb-1">
            Frequency
          </p>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="one-time"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={filters.frequency.includes("one-time")}
                onChange={() => handleCheckboxChange("frequency", "one-time")}
              />
              <label
                htmlFor="one-time"
                className="ml-2 block text-sm text-gray-700"
              >
                One-time
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="recurring"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={filters.frequency.includes("recurring")}
                onChange={() => handleCheckboxChange("frequency", "recurring")}
              />
              <label
                htmlFor="recurring"
                className="ml-2 block text-sm text-gray-700"
              >
                Recurring
              </label>
            </div>
          </div>
        </div>

        <div>
          <p className="block text-sm font-medium text-gray-700 mb-1">
            Categories
          </p>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {[
              "Education",
              "Health",
              "Environment",
              "Animal Welfare",
              "Community Service",
              "Disaster Relief",
              "Arts & Culture",
              "Food Security",
              "Homelessness",
              "Mentoring",
            ].map((category) => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category.toLowerCase().replace(" ", "-")}`}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCheckboxChange("categories", category)}
                />
                <label
                  htmlFor={`category-${category.toLowerCase().replace(" ", "-")}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
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
