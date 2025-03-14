// components/TimeCommitmentSelector.tsx
"use client";

import { useState } from "react";

export default function TimeCommitmentSelector() {
  const [hoursPerWeek, setHoursPerWeek] = useState("");

  return (
    <div>
      <label
        htmlFor="hours"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Hours Available Per Week
      </label>
      <select
        id="hours"
        name="hours"
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        value={hoursPerWeek}
        onChange={(e) => setHoursPerWeek(e.target.value)}
      >
        <option value="">Select hours</option>
        <option value="1-5">1-5 hours</option>
        <option value="5-10">5-10 hours</option>
        <option value="10-20">10-20 hours</option>
        <option value="20+">20+ hours</option>
      </select>
    </div>
  );
}
