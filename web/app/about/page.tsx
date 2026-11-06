import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mūsų istorija",
  description:
    "Obuolių sūris – tradicinis lietuviškas skanėstas iš lėtai troškintų obuolių. Sužinokite, kaip jį gaminame.",
};

const VALUES = [
  { title: "Paprasti ingredientai", text: "Obuoliai, trupūtis cukraus ar medaus, kartais čili, riešutai ar cinamonas. Nieko daugiau." },
  { title: "Kantrybė", text: "Mūsų luitai troškinami ir džiovinami lėtai, kaip liepia senieji receptai." },
  { title: "Sąžininga pakuotė", text: "Perdirbamos medžiagos ir ne didesnė, nei būtina." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <p className="eyebrow">Mūsų istorija</p>
        <h1 className="mt-4 text-4xl leading-tight text-ink md:text-5xl">
          Šimtmečių senumo receptas, gaminamas neskubant
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-muted">
          Obuolių sūris Lietuvoje gaminamas nuo viduramžių. Seniausias žinomas receptas užrašytas Radvilų
          virtuvėje, o 1907 m. vienas jo variantas pasirodė Vilniuje išleistoje knygoje „Lietuvos virėja“.
          Obuoliai buvo troškinami su medumi, vėliau su cukrumi, tada spaudžiami ir džiovinami, kol galima
          pjaustyti.
        </p>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Pradėjome jį gaminti, nes parduotuvėse pirkti variantai niekada nebuvo tokio skonio kaip senelių
          virtuvėje. Šiandien gaminame keliais skoniais: nuo klasikinio iki čili ir riešutų.
        </p>
      </section>

      <div className="relative mx-auto aspect-[16/9] max-w-6xl bg-line md:aspect-[21/9]">
        <Image
          src="/images/products/gift-box.jpg"
          alt="Supakuotas obuolių sūris"
          fill
          sizes="(min-width: 1152px) 1152px, 100vw"
          className="object-cover"
        />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <h2 className="text-3xl text-ink md:text-4xl">Kuo vadovaujamės</h2>
        <dl className="mt-10 grid gap-8 md:grid-cols-3 md:gap-12">
          {VALUES.map((v) => (
            <div key={v.title} className="border-t border-ink pt-4">
              <dt className="font-display text-xl text-ink">{v.title}</dt>
              <dd className="mt-2 text-muted">{v.text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-14 text-lg text-ink">
          Pasirinkite skonį arba išbandykite visus degustacinėje dėžutėje.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link href="/products" className="btn-primary px-8 py-4">Pirkti obuolių sūrį</Link>
          <Link href="/contact" className="text-sm text-ink underline underline-offset-4 hover:text-brand">
            Susisiekite
          </Link>
        </div>
      </section>
    </div>
  );
}
