import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "../../lib/format";
import { getPricing } from "../../lib/serverPricing";
import { CONTACT_EMAIL } from "../../lib/site";

export const metadata: Metadata = {
  title: "Pristatymas ir grąžinimas",
  description: "Pristatymo kaina, terminai ir grąžinimo sąlygos.",
};

// The shipping price comes from the API, so refresh it periodically instead of freezing it at build time
export const revalidate = 3600;

export default async function DeliveryPage() {
  const pricing = await getPricing();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
      <h1 className="text-4xl text-ink md:text-5xl">Pristatymas ir grąžinimas</h1>

      <dl className="mt-10 divide-y divide-line border-y border-line">
        <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
          <dt className="text-muted">Kur pristatome</dt>
          <dd className="text-ink">Visoje Lietuvoje</dd>
        </div>
        <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
          <dt className="text-muted">Pristatymo kaina</dt>
          <dd className="text-ink">{formatPrice(pricing.shipping)} už užsakymą</dd>
        </div>
        <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
          <dt className="text-muted">Pristatymo terminas</dt>
          <dd className="text-ink">1–3 darbo dienos nuo užsakymo išsiuntimo</dd>
        </div>
        <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
          <dt className="text-muted">Apmokėjimas</dt>
          <dd className="text-ink">Demonstracinis režimas: tikras mokėjimas neatliekamas</dd>
        </div>
      </dl>

      <section className="mt-12">
        <h2 className="text-2xl text-ink">Kaip pakuojame</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Kiekvieną luitą įpakuojame atskirai, o dovanų rinkinius – į tvirtą dėžutę, kad prekė atkeliautų
          nepažeista.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl text-ink">Grąžinimas ir pretenzijos</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Jei prekė atkeliavo pažeista ar neatitinka užsakymo, parašykite mums per 48 valandas nuo gavimo ir
          pridėkite nuotrauką. Prekę pakeisime arba grąžinsime pinigus.
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          Pagal Lietuvos vartotojų teisių taisykles, greitai gendančių ar atidarytų maisto prekių grąžinti
          negalima. Jei turite klausimų, rašykite {CONTACT_EMAIL} arba{" "}
          <Link href="/contact" className="text-ink underline underline-offset-4 hover:text-brand">
            naudokitės kontaktų forma
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
