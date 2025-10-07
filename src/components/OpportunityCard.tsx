// src/components/OpportunityCard.tsx
import Link from "next/link";
import { Listing } from "@/payload-types";

interface OpportunityCardProps {
  opportunity: Listing;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  // Extract organization name (handle relationship)
  const organizationName =
    typeof opportunity.organization === "object" && opportunity.organization
      ? opportunity.organization.name
      : "Organization";

  // Format location types
  const locationTypes = opportunity.location?.type || [];
  const isRemote = locationTypes.includes("Remote");
  const isInPerson =
    locationTypes.includes("In-person") || locationTypes.includes("Hybrid");

  // Get location display text
  const getLocationDisplay = () => {
    if (locationTypes.length === 0) return "Location not specified";
    if (isRemote && !isInPerson) return "Remote";
    if (!isRemote && isInPerson) return "In-Person";
    if (isRemote && isInPerson) return "Hybrid";
    if (locationTypes.includes("Lifestyle")) return "Lifestyle";
    return locationTypes.join(", ");
  };

  // Format schedule display
  const getScheduleDisplay = () => {
    if (!opportunity.schedule) return "Schedule flexible";

    const { type, minTimeBlock } = opportunity.schedule;

    if (type === "Any Time") {
      return `Flexible (min ${minTimeBlock} hours)`;
    } else if (type === "Weekly") {
      return `Weekly commitment (min ${minTimeBlock} hours)`;
    } else if (type === "Specific Date(s)") {
      return `Scheduled dates (min ${minTimeBlock} hours)`;
    }

    return "Schedule available";
  };

  // Get tags/categories for display
  const displayTags = opportunity.tags?.slice(0, 3) || [];
  const hasMoreTags = (opportunity.tags?.length || 0) > 3;

  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer border border-gray-200 hover:border-blue-300">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {opportunity.title}
            </h3>
            <p className="text-sm text-gray-600">{organizationName}</p>
          </div>

          {/* Location badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isRemote
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {getLocationDisplay()}
          </span>
        </div>

        {/* Schedule info */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Schedule:</span>{" "}
            {getScheduleDisplay()}
          </p>
        </div>

        {/* Role description preview */}
        {opportunity.role && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 line-clamp-2">
              {/* Extract plain text from rich text field */}
              {typeof opportunity.role === "string"
                ? opportunity.role
                : "View details for full description"}
            </p>
          </div>
        )}

        {/* Tags/Categories */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {hasMoreTags && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                +{(opportunity.tags?.length || 0) - 3} more
              </span>
            )}
          </div>
        )}

        {/* Skills */}
        {opportunity.skills && opportunity.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Skills:</span>{" "}
              {opportunity.skills.slice(0, 3).join(", ")}
              {opportunity.skills.length > 3 && "..."}
            </p>
          </div>
        )}

        {/* View details link */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-sm text-blue-600 font-medium hover:text-blue-800">
            View Details →
          </span>
          <span className="text-xs text-gray-400">
            Updated {new Date(opportunity.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
