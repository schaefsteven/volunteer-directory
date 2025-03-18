// src/app/(app)/layout.tsx
import Navbar from "@/components/Navbar";
import Link from "next/link";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/(app)/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VolunteerConnect - Find Local Volunteer Opportunities",
  description:
    "Connect with local and national volunteer opportunities that match your interests and availability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gray-50">{children}</main>
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-lg font-bold mb-2">VolunteerConnect</h3>
                <p className="text-gray-300">
                  Connecting volunteers with meaningful opportunities.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-gray-400 uppercase tracking-wider">
                    Explore
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/opportunities"
                        className="text-gray-300 hover:text-white"
                      >
                        Find Opportunities
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about"
                        className="text-gray-300 hover:text-white"
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        className="text-gray-300 hover:text-white"
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-gray-400 uppercase tracking-wider">
                    Account
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/login"
                        className="text-gray-300 hover:text-white"
                      >
                        Log In
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/register"
                        className="text-gray-300 hover:text-white"
                      >
                        Sign Up
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-400 text-sm text-center">
                © {new Date().getFullYear()} VolunteerConnect. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
