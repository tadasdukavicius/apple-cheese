import type { MetadataRoute } from "next";
import { fetchAPI } from "../lib/api";
import type { Product } from "../types/product";
import { SITE_URL } from "../lib/config";



export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/products", "/about", "/delivery", "/faq", "/contact"].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  const products = await fetchAPI<Product[]>("products").catch(() => []);

  return [
    ...pages,
    ...products.map((p) => ({
      url: `${SITE_URL}/products/${p.id}`,
      lastModified: p.created_at || undefined,
    })),
  ];
}
