// src/app/(app)/opportunities/page.tsx
import { getPayload } from "payload";
import type { Where } from "payload";
import config from "@payload-config";
import { Suspense } from "react";
import OpportunityCard from "@/components/OpportunityCard";
import ClientFilters from "@/components/ClientFilters";
import ClientPagination from "@/components/ClientPagination";
import ClientSort from "@/components/ClientSort";
import ClientSearch from "@/components/ClientSearch";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    format?: string;
    commitment?: string;
    schedule?: string;
    frequency?: string;
    categories?: string;
    skills?: string;
    sort?: string;
  }>;
}

export default async function OpportunitiesPage({ searchParams }: PageProps) {
  // Await searchParams in Next.js 15
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const itemsPerPage = 5;

  // Get Payload instance
  const payload = await getPayload({ config });

  // Build where clause from search params
  const where: Where = {};

  // Search
  if (params.search) {
    where.or = [
      { title: { contains: params.search } },
      { "organization.name": { contains: params.search } },
    ];
  }

  // Format filter (remote/in-person)
  if (params.format === "remote") {
    where["location.type"] = { contains: "Remote" };
  } else if (params.format === "in-person") {
    where["location.type"] = { in: ["In-person", "Hybrid"] };
  }

  // Skills filter
  if (params.skills) {
    const skillsArray = params.skills.split(",");
    where.skills = { in: skillsArray };
  }

  // Categories filter
  if (params.categories) {
    const categoriesArray = params.categories.split(",");
    where.tags = { in: categoriesArray };
  }

  // Determine sort
  let sort = "-createdAt"; // Default: newest
  if (params.sort === "oldest") {
    sort = "createdAt";
  } else if (params.sort === "alphabetical") {
    sort = "title";
  }

  // Query database using Payload's Local API
  const {
    docs: listings,
    totalPages,
    totalDocs,
  } = await payload.find({
    collection: "listings",
    limit: itemsPerPage,
    page,
    where: Object.keys(where).length > 0 ? where : undefined,
    sort,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">
        Volunteer Opportunities
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop filters */}
        <div className="hidden md:block md:w-1/4">
          <Suspense
            fallback={
              <div className="bg-white rounded-lg shadow p-6 h-96 animate-pulse" />
            }
          >
            <ClientFilters />
          </Suspense>
        </div>

        <div className="md:w-3/4">
          <Suspense
            fallback={
              <div className="mb-6 h-12 bg-gray-200 rounded animate-pulse" />
            }
          >
            <ClientSearch />
          </Suspense>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <Suspense
              fallback={
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
              }
            >
              <ClientSort />
            </Suspense>
            <p className="text-sm text-gray-500 mt-2 sm:mt-0">
              Showing {listings.length} of {totalDocs} opportunities
            </p>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">
                No volunteer opportunities found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6">
                {listings.map((listing) => (
                  <OpportunityCard key={listing.id} opportunity={listing} />
                ))}
              </div>

              {totalPages > 1 && (
                <Suspense
                  fallback={
                    <div className="mt-8 h-12 bg-gray-200 rounded animate-pulse" />
                  }
                >
                  <ClientPagination
                    currentPage={page}
                    totalPages={totalPages}
                  />
                </Suspense>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
