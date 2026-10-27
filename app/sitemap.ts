import type { MetadataRoute } from "next";
import { fetchAPI } from "../lib/api";
import type { Product } from "../types/product";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/products", "/about", "/delivery", "/faq", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
  }));

  const products = await fetchAPI<Product[]>("products").catch(() => []);

  return [
    ...pages,
    ...products.map((p) => ({
      url: `${siteUrl}/products/${p.id}`,
      lastModified: p.created_at || undefined,
    })),
  ];
}
