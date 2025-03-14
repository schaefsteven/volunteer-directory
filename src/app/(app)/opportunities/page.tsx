// src/app/(app)/opportunities/page.tsx
"use client";

import { useState, useEffect } from "react";
import OpportunityCard from "@/components/OpportunityCard";
import FilterSidebar from "@/components/FilterSidebar";
import Pagination from "@/components/Pagination";
import SortSelector from "@/components/SortSelector";
import SearchBar from "@/components/Searchbar";
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Volunteer Opportunities
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        <div className="md:w-3/4">
          <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />

          <div className="flex justify-between items-center mb-6">
            <SortSelector
              onSortChange={handleSortChange}
              currentSort={sortOption}
            />
            <p className="text-sm text-gray-500">
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
