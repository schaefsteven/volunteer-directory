// src/app/(app)/opportunities/page.tsx
"use client";

import { useState, useEffect } from "react";
import OpportunityCard from "@/components/OpportunityCard";
import FilterSidebar from "@/components/FilterSidebar";
import Pagination from "@/components/Pagination";
import SortSelector from "@/components/SortSelector";
import SearchBar from "@/components/SearchBar";
import { getDummyOpportunities, Opportunity } from "@/lib/dummyData";

// Define interface for filter state
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

export default function OpportunitiesPage() {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State for filtering with proper typing
  const [filterState, setFilterState] = useState<FilterState>({
    commitment: "",
    format: "",
    location: "",
    radius: "10",
    schedule: [],
    frequency: [],
    categories: [],
    skills: [],
  });

  // Add to your existing state in the component
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // State for sorting
  const [sortOption, setSortOption] = useState("newest");

  // State for search
  const [searchQuery, setSearchQuery] = useState("");

  // State for opportunities - Fix the declaration to avoid the iterator error
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);

  // This is the line causing the error - fix it by explicitly typing the state and its setter
  const [filteredOpportunities, setFilteredOpportunities] = useState<
    Opportunity[]
  >([]);

  // Load initial data
  useEffect(() => {
    const opportunities = getDummyOpportunities();
    setAllOpportunities(opportunities);
    setFilteredOpportunities(opportunities);
  }, []);

  // Apply filters, sorting, and search
  useEffect(() => {
    let result = [...allOpportunities];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (opp) =>
          opp.title.toLowerCase().includes(query) ||
          opp.organization.toLowerCase().includes(query) ||
          opp.description.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filterState.format) {
      result = result.filter((opp) =>
        filterState.format === "remote" ? opp.isRemote : !opp.isRemote
      );
    }

    if (filterState.commitment) {
      // Implement commitment filtering logic
      if (filterState.commitment === "1-5") {
        result = result.filter((opp) => opp.commitment.hoursPerWeek <= 5);
      } else if (filterState.commitment === "5-10") {
        result = result.filter(
          (opp) =>
            opp.commitment.hoursPerWeek > 5 && opp.commitment.hoursPerWeek <= 10
        );
      } else if (filterState.commitment === "10-20") {
        result = result.filter(
          (opp) =>
            opp.commitment.hoursPerWeek > 10 &&
            opp.commitment.hoursPerWeek <= 20
        );
      } else if (filterState.commitment === "20+") {
        result = result.filter((opp) => opp.commitment.hoursPerWeek > 20);
      }
    }

    if (filterState.schedule.length > 0) {
      result = result.filter((opp) => {
        if (
          filterState.schedule.includes("scheduled") &&
          !opp.commitment.isFlexible
        )
          return true;
        if (
          filterState.schedule.includes("flexible") &&
          opp.commitment.isFlexible
        )
          return true;
        return false;
      });
    }

    if (filterState.frequency.length > 0) {
      result = result.filter((opp) => {
        if (
          filterState.frequency.includes("recurring") &&
          opp.commitment.isRecurring
        )
          return true;
        if (
          filterState.frequency.includes("one-time") &&
          !opp.commitment.isRecurring
        )
          return true;
        return false;
      });
    }

    if (filterState.categories.length > 0) {
      result = result.filter((opp) =>
        opp.categories.some((category) =>
          filterState.categories.includes(category)
        )
      );
    }

    // Apply sorting
    if (sortOption === "newest") {
      // In a real app, you'd sort by creation date
      // For dummy data, we'll just use the reverse of the original order
      result = [...result].reverse();
    } else if (sortOption === "oldest") {
      // Do nothing, assume the default order is oldest first
    } else if (sortOption === "hoursAsc") {
      result = [...result].sort(
        (a, b) => a.commitment.hoursPerWeek - b.commitment.hoursPerWeek
      );
    } else if (sortOption === "hoursDesc") {
      result = [...result].sort(
        (a, b) => b.commitment.hoursPerWeek - a.commitment.hoursPerWeek
      );
    } else if (sortOption === "alphabetical") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredOpportunities(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allOpportunities, filterState, sortOption, searchQuery]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOpportunities = filteredOpportunities.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleFilterChange = (filters: FilterState) => {
    setFilterState(filters);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // src/app/(app)/opportunities/page.tsx
  // Update the return section

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">
        Volunteer Opportunities
      </h1>

      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <span>Filters</span>
          <svg
            className="ml-2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Mobile filter panel */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setMobileFiltersOpen(false)}
          ></div>
          <div className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col">
            <div className="px-4 py-5 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                type="button"
                className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="px-4 overflow-y-auto">
              <FilterSidebar onFilterChange={handleFilterChange} />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop filters */}
        <div className="hidden md:block md:w-1/4">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        <div className="md:w-3/4">
          <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <SortSelector
              onSortChange={handleSortChange}
              currentSort={sortOption}
            />
            <p className="text-sm text-gray-500 mt-2 sm:mt-0">
              Showing {filteredOpportunities.length} opportunities
            </p>
          </div>

          {currentOpportunities.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">
                No volunteer opportunities found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6">
                {currentOpportunities.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
