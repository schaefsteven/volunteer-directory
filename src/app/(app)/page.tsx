// src/app/(app)/page.tsx
import Link from "next/link";
import LocationSelector from "@/components/LocationSelector";
import TimeCommitmentSelector from "@/components/TimeCommitmentSelector";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="relative">
        {/* Hero image (consider adding a responsive background image here) */}
        <div className="bg-blue-800 bg-opacity-80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                Make a <span className="text-blue-300">Difference</span>
              </h1>
              <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-blue-100">
                Connect with local and national volunteer opportunities that
                match your interests and availability.
              </p>

              <div className="mt-8 sm:mt-10">
                <Link
                  href="/opportunities"
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse All Opportunities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Find the Perfect Volunteer Opportunity
          </h2>
          <p className="mt-4 text-gray-500 max-w-3xl mx-auto">
            Tell us your location and availability, and we&apos;ll match you
            with opportunities that fit your schedule.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-gray-50 rounded-xl shadow-md p-4 sm:p-6">
          <div className="space-y-6">
            <LocationSelector />
            <TimeCommitmentSelector />

            <div>
              <Link
                href="/opportunities"
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Find Opportunities
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories Section */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Volunteer Categories
            </h2>
            <p className="mt-4 text-gray-500 max-w-3xl mx-auto">
              Explore opportunities in these popular categories
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              "Education",
              "Health",
              "Environment",
              "Animal Welfare",
              "Community Service",
              "Disaster Relief",
              "Arts & Culture",
              "Food Security",
            ].map((category) => (
              <Link
                key={category}
                href={`/opportunities?category=${category.toLowerCase().replace(" ", "-")}`}
                className="group bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                  {category}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                1
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Find Opportunities
              </h3>
              <p className="text-gray-500">
                Search for volunteer opportunities that match your interests and
                availability.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                2
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Connect
              </h3>
              <p className="text-gray-500">
                Reach out to organizations and learn more about how you can
                help.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                3
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Make a Difference
              </h3>
              <p className="text-gray-500">
                Start volunteering and create positive change in your community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Ready to Make a Difference?
            </h2>
            <p className="mt-4 text-blue-100 max-w-3xl mx-auto">
              Join thousands of volunteers who are creating positive change in
              their communities.
            </p>

            <div className="mt-8">
              <Link
                href="/opportunities"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Find Opportunities Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
