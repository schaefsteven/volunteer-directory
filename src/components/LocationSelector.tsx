// components/LocationSelector.tsx
"use client";

import { useState } from "react";

export default function LocationSelector() {
  const [location, setLocation] = useState("");

  return (
    <div>
      <label
        htmlFor="location"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Your Location
      </label>
      <input
        type="text"
        id="location"
        name="location"
        placeholder="City, State or Zip Code"
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
    </div>
  );
}
