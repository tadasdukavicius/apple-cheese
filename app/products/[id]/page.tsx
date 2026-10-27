import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "../../../types/product";
import { fetchAPI, ApiError } from "../../../lib/api";
import { getPricing } from "../../../lib/serverPricing";
import DeliveryNote from "../../../components/DeliveryNote";
import ProductPurchase from "../../../components/ProductPurchase";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const getProduct = cache((id: string) =>
  fetchAPI<Product>(`products/${id}`).catch((err) => {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) return null;
    throw err;
  })
);

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Produktas nerastas" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: [product.image_url] },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const [product, pricing] = await Promise.all([getProduct(id), getPricing()]);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <nav aria-label="Kelias" className="mb-6 text-sm text-muted">
        <Link href="/products" className="hover:text-brand">Parduotuvė</Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:gap-14">
        <div className="relative aspect-square bg-line md:aspect-[4/5]">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl leading-tight text-ink md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{product.description}</p>

          <div className="mt-8">
            <ProductPurchase variants={product.variants} productId={product.id} />
          </div>

          <div className="mt-8">
            <DeliveryNote shipping={pricing.shipping} />
          </div>

          {product.features.length > 0 && (
            <div className="mt-8 border-t border-line pt-6">
              <h2 className="mb-3 text-xl text-ink">Gera žinoti</h2>
              <ul className="space-y-2 text-sm text-ink">
                {product.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
