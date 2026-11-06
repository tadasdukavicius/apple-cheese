import type { Metadata } from "next";
import credits from "../../lib/imageCredits.json";

export const metadata: Metadata = {
  title: "Nuotraukų autoriai",
  description: "Šioje svetainėje naudojamų nuotraukų autoriai ir licencijos.",
};

export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <div>
        <h1 className="text-4xl md:text-5xl font-medium text-ink mb-4">Nuotraukų autoriai</h1>
        <p className="text-muted mb-8">
          Nuotraukos paimtos iš Wikimedia Commons ir naudojamos pagal Creative Commons licencijas. Kai kurios
          apkarpytos ir pakeistas jų dydis.
        </p>
        <ul className="space-y-4">
          {credits.map((c) => (
            <li key={c.file} className="card p-4 text-sm">
              <a href={c.source} className="font-medium text-brand hover:underline" target="_blank" rel="noreferrer">
                {c.title}
              </a>
              <p className="text-muted mt-1">
                Autorius: {c.author} ·{" "}
                {c.licenseUrl ? (
                  <a href={c.licenseUrl} className="hover:underline" target="_blank" rel="noreferrer">
                    {c.license}
                  </a>
                ) : (
                  c.license
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
