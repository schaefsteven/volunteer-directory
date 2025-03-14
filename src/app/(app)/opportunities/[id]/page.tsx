// src/app/(app)/opportunities/[id]/page.tsx
import Link from "next/link";
import { getOpportunityById } from "@/lib/dummyData";
import { notFound } from "next/navigation";

export default function OpportunityDetail({
  params,
}: {
  params: { id: string };
}) {
  const opportunity = getOpportunityById(params.id);

  if (!opportunity) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link
          href="/opportunities"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to opportunities
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {opportunity.title}
              </h1>
              <p className="text-xl text-gray-600 mt-1">
                {opportunity.organization}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  opportunity.isRemote
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {opportunity.isRemote ? "Remote" : "In-Person"}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {opportunity.commitment.hoursPerWeek} hrs/week
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {opportunity.commitment.isFlexible
                  ? "Flexible Schedule"
                  : "Fixed Schedule"}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {opportunity.commitment.isRecurring ? "Recurring" : "One-time"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p>{opportunity.description}</p>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                Getting Started
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p>{opportunity.firstStep}</p>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {opportunity.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Contact Information
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-gray-500 font-medium w-24">
                      Name:
                    </span>
                    <span>{opportunity.contactInfo.name}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 font-medium w-24">
                      Email:
                    </span>
                    <a
                      href={`mailto:${opportunity.contactInfo.email}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {opportunity.contactInfo.email}
                    </a>
                  </li>
                  {opportunity.contactInfo.phone && (
                    <li className="flex items-start">
                      <span className="text-gray-500 font-medium w-24">
                        Phone:
                      </span>
                      <span>{opportunity.contactInfo.phone}</span>
                    </li>
                  )}
                  {opportunity.website && (
                    <li className="flex items-start">
                      <span className="text-gray-500 font-medium w-24">
                        Website:
                      </span>
                      <a
                        href={opportunity.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Visit Website
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Location
                </h3>
                {opportunity.isRemote ? (
                  <p className="text-gray-700">This is a remote opportunity.</p>
                ) : (
                  <div>
                    <p className="text-gray-700 mb-2">
                      {opportunity.location.address}
                    </p>
                    <p className="text-gray-700">
                      {opportunity.location.city}, {opportunity.location.state}{" "}
                      {opportunity.location.zipCode}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
