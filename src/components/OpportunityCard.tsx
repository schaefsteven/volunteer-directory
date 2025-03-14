// components/OpportunityCard.tsx
import Link from "next/link";

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  isRemote: boolean;
  commitment: {
    hoursPerWeek: number;
    isFlexible: boolean;
    isRecurring: boolean;
  };
  categories: string[];
  location: {
    city: string;
    state: string;
  };
}

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {opportunity.title}
              </h3>
              <p className="text-gray-600">{opportunity.organization}</p>
            </div>
            <div className="flex space-x-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  opportunity.isRemote
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {opportunity.isRemote ? "Remote" : "In-Person"}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {opportunity.commitment.hoursPerWeek} hrs/week
              </span>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-700 line-clamp-3">
              {opportunity.description}
            </p>
          </div>

          <div className="mt-4 flex items-center text-sm text-gray-500">
            <svg
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              {opportunity.location.city}, {opportunity.location.state}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {opportunity.categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
              >
                {category}
              </span>
            ))}
            {opportunity.categories.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                +{opportunity.categories.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
