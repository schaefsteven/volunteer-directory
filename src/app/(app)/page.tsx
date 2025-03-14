import Link from "next/link";
import LocationSelector from "@/components/LocationSelector";
import TimeCommitmentSelector from "@/components/TimeCommitmentSelector";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Make a <span className="text-blue-600">Difference</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Connect with local and national volunteer opportunities that match
            your interests and availability.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-gray-50 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Find Opportunities
          </h2>

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
    </main>
  );
}
