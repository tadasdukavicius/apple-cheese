import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-black dark:text-zinc-50 mb-12 text-center">
          About Apple & Cheese
        </h1>
        
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-6">
              Our Story
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            </p>
          </div>

          {/* Mission & Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-6">
                Our Mission
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-6">
                Our Values
              </h2>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-6">
              Ready to Taste the Difference?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">
              Explore our carefully curated selection of premium apples and artisanal cheeses.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/products"
                className="bg-black dark:bg-zinc-50 text-white dark:text-black px-8 py-3 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
              >
                Shop Products
              </Link>
              <Link
                href="/contact"
                className="border-2 border-black dark:border-zinc-50 text-black dark:text-zinc-50 px-8 py-3 rounded-lg font-medium hover:bg-black hover:text-white dark:hover:bg-zinc-50 dark:hover:text-black transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}