import type { Metadata } from "next";
import ContactForm from "../../components/ContactForm";
import { CONTACT_EMAIL, CONTACT_HOURS, CONTACT_PHONE } from "../../lib/site";

export const metadata: Metadata = {
  title: "Kontaktai",
  description: "Turite klausimų apie užsakymą ar mūsų produktus? Parašykite mums.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="text-4xl text-ink md:text-5xl">Susisiekite su mumis</h1>
      <p className="mt-3 max-w-xl text-muted">
        Turite klausimų apie užsakymą ar produktus? Parašykite, ir atsakysime kuo greičiau.
      </p>

      <div className="mt-10 grid gap-12 md:grid-cols-[3fr_2fr] md:gap-16">
        <ContactForm />

        <dl className="space-y-6 border-t border-ink pt-4 text-sm md:self-start">
          <div>
            <dt className="text-muted">El. paštas</dt>
            <dd className="mt-1 text-lg text-ink">{CONTACT_EMAIL}</dd>
          </div>
          <div>
            <dt className="text-muted">Telefonas</dt>
            <dd className="mt-1 text-lg text-ink">{CONTACT_PHONE}</dd>
          </div>
          <div>
            <dt className="text-muted">Darbo laikas</dt>
            <dd className="mt-1 text-lg text-ink">{CONTACT_HOURS}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
