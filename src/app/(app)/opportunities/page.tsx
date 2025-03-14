// src/app/(app)/opportunities/page.tsx
import OpportunityCard from "@/components/OpportunityCard";
import FilterSidebar from "@/components/FilterSidebar";
import { getDummyOpportunities } from "@/lib/dummyData";

export default function OpportunitiesPage() {
  // In a real app, you'd fetch this data from your API
  const opportunities = getDummyOpportunities();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Volunteer Opportunities
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <FilterSidebar />
        </div>

        <div className="md:w-3/4">
          {opportunities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No volunteer opportunities found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
