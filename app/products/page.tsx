import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "../../components/ProductCard";
import ProductFilters from "../../components/ProductFilters";
import { fetchAPI } from "../../lib/api";
import type { Product } from "../../types/product";

export const metadata: Metadata = { title: "Products | Apple & Cheese" };

interface ProductsPageProps {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { q = "", category = "", sort = "newest" } = await searchParams;

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (sort !== "newest") params.set("sort", sort);
  const qs = params.toString();

  const products = await fetchAPI<Product[]>(`products${qs ? `?${qs}` : ""}`);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-8">Products</h1>
        <ProductFilters q={q} category={category} sort={sort} />

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">No products match your search.</p>
            <Link href="/products" className="text-black dark:text-zinc-50 font-medium underline">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
