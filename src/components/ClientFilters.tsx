// src/components/ClientFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ClientFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL params
  const [commitment, setCommitment] = useState(
    searchParams.get("commitment") || ""
  );
  const [format, setFormat] = useState(searchParams.get("format") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [radius, setRadius] = useState(searchParams.get("radius") || "10");

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Update params
    if (commitment) {
      params.set("commitment", commitment);
    } else {
      params.delete("commitment");
    }

    if (format) {
      params.set("format", format);
    } else {
      params.delete("format");
    }

    if (location) {
      params.set("location", location);
    } else {
      params.delete("location");
    }

    if (radius !== "10") {
      params.set("radius", radius);
    } else {
      params.delete("radius");
    }

    // Reset to page 1 when filters change
    params.delete("page");

    // Navigate with new params
    router.push(`/opportunities?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setCommitment("");
    setFormat("");
    setLocation("");
    setRadius("10");
    router.push("/opportunities");
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
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
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
            value={format}
            onChange={(e) => setFormat(e.target.value)}
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <select
                id="radius"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
              >
                <option value="5">5 mi</option>
                <option value="10">10 mi</option>
                <option value="25">25 mi</option>
                <option value="50">50 mi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <button
            onClick={handleApplyFilters}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
