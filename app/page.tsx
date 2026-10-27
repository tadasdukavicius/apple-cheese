import Image from "next/image";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { fetchAPI } from "../lib/api";
import { formatPrice } from "../lib/format";
import { getPricing } from "../lib/serverPricing";
import type { Product } from "../types/product";

async function getProducts(): Promise<Product[]> {
  try {
    return await fetchAPI<Product[]>("products");
  } catch {
    // The landing page should still render if the API is unavailable
    return [];
  }
}

// Re-fetched at most once a minute so the catalogue stays fresh
export const revalidate = 60;

export default async function Home() {
  const [products, pricing] = await Promise.all([getProducts(), getPricing()]);

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:gap-16 md:px-6 md:py-20">
        <div>
          <p className="eyebrow">Lietuviška tradicija</p>
          <h1 className="mt-5 text-5xl leading-[1.05] text-ink md:text-6xl">
            Obuolių sūris, gamintas neskubant.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Lėtai troškinti obuoliai, suspausti į pjaustomą luitą. Be pieno, be priedų: klasikinis, su čili,
            riešutais, medumi ar cinamonu.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/products" className="btn-primary px-8 py-4">Pirkti obuolių sūrį</Link>
            <Link href="/about" className="text-sm text-ink underline underline-offset-4 hover:text-brand">
              Mūsų istorija
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted">
            Pristatymas visoje Lietuvoje · {formatPrice(pricing.shipping)} · 1–3 darbo dienos
          </p>
        </div>

        <div className="relative aspect-[4/5] w-full bg-line">
          <Image
            src="/images/hero-plate.jpg"
            alt="Obuolių sūrio luitas ant lėkštės šalia nupjauto gabalėlio"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {products.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 className="text-3xl text-ink md:text-4xl">Mūsų skoniai</h2>
              <Link href="/products" className="text-sm text-ink underline underline-offset-4 hover:text-brand">
                Visi produktai
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
              {products.slice(0, 6).map((p) => (
                <ProductCard key={p.id} product={p} headingAs="h3" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-16 md:px-6 md:py-24">
          <div className="relative aspect-square bg-line md:order-2">
            <Image
              src="/images/products/classic.jpg"
              alt="Klasikinis obuolių sūris"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Apie produktą</p>
            <h2 className="mt-4 text-3xl text-ink md:text-4xl">Kas yra obuolių sūris?</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Nepaisant pavadinimo, jame nėra pieno. Obuolių sūris – tradicinis lietuvių ir lenkų desertas:
              obuoliai troškinami su cukrumi ar medumi, kol sutirštėja, tada suspaudžiami ir išdžiovinami į
              tvirtą luitą.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Pjaustykite kaip sūrį ir valgykite su arbata, ant duonos ar prie sūrių lentelės.
            </p>
            <Link href="/about" className="mt-6 inline-block text-sm text-ink underline underline-offset-4 hover:text-brand">
              Skaitykite mūsų istoriją
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <h2 className="text-3xl text-ink md:text-4xl">Pristatymas ir pakuotė</h2>
          <dl className="mt-10 grid gap-8 md:grid-cols-3 md:gap-12">
            <div className="border-t border-ink pt-4">
              <dt className="font-display text-xl text-ink">Visoje Lietuvoje</dt>
              <dd className="mt-2 text-muted">
                Pristatymas {formatPrice(pricing.shipping)}. Siunčiame per 1–3 darbo dienas.
              </dd>
            </div>
            <div className="border-t border-ink pt-4">
              <dt className="font-display text-xl text-ink">Saugi pakuotė</dt>
              <dd className="mt-2 text-muted">Kiekvieną luitą kruopščiai įpakuojame, kad atkeliautų nepažeistas.</dd>
            </div>
            <div className="border-t border-ink pt-4">
              <dt className="font-display text-xl text-ink">Dovanų rinkiniai</dt>
              <dd className="mt-2 text-muted">
                Visi penki skoniai vienoje dėžutėje.{" "}
                <Link href="/products?category=gift_sets" className="text-ink underline underline-offset-4 hover:text-brand">
                  Peržiūrėti
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
