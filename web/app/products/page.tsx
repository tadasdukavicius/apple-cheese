import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "../../components/ProductCard";
import ProductFilters from "../../components/ProductFilters";
import { fetchAPI } from "../../lib/api";
import type { Product } from "../../types/product";

export const metadata: Metadata = {
  title: "Parduotuvė",
  description: "Klasikinis, čili, riešutų, medaus ir cinamono obuolių sūris bei dovanų rinkiniai.",
};

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
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <header className="mb-8">
        <h1 className="text-4xl text-ink md:text-5xl">Parduotuvė</h1>
        <p className="mt-3 max-w-xl text-muted">
          Lėtai troškintas obuolių sūris keliais skoniais. Pristatome visoje Lietuvoje.
        </p>
      </header>

      <ProductFilters q={q} category={category} sort={sort} />

      {products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="mb-4 text-muted">Pagal jūsų paiešką produktų nerasta.</p>
          <Link href="/products" className="font-medium text-ink underline underline-offset-4">
            Išvalyti filtrus
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
