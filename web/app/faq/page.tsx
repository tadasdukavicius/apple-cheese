import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DUK",
  description: "Dažniausiai užduodami klausimai apie obuolių sūrį, užsakymus ir pristatymą.",
};

const FAQ = [
  {
    q: "Ar obuolių sūryje yra pieno?",
    a: "Ne. Obuolių sūris gaminamas tik iš obuolių, cukraus ar medaus, o kai kuriuose skoniuose dar iš čili, riešutų ar cinamono. Pavadinimas kilęs iš to, kad luitą galima pjaustyti kaip sūrį.",
  },
  {
    q: "Ar jis tinka veganams?",
    a: "Klasikinis, čili, riešutų ir cinamono skoniai neturi gyvūninių produktų. Medumi saldintas obuolių sūris veganams netinka.",
  },
  {
    q: "Ar yra alergenų?",
    a: "Riešutinio obuolių sūrio sudėtyje yra graikinių ir lazdyno riešutų. Dovanų dėžutėje taip pat yra šio skonio luitas.",
  },
  {
    q: "Kaip valgyti obuolių sūrį?",
    a: "Pjaustykite plonomis riekelėmis ir valgykite su arbata ar kava, ant duonos arba prie sūrių lentelės. Čili skonis puikiai dera su aštresniais sūriais.",
  },
  {
    q: "Kaip jį laikyti?",
    a: "Laikykite vėsioje, sausoje vietoje, sandariai uždengtą. Atidarytą luitą geriausia laikyti šaldytuve.",
  },
  {
    q: "Kuo skiriasi dydžiai?",
    a: "Tas pats receptas, skiriasi tik svoris: 150 g tinka paragauti, didesni luitai – šeimai ar dovanai. Kaina už kiekvieną dydį nurodyta produkto puslapyje.",
  },
  {
    q: "Kiek kainuoja pristatymas?",
    a: "Informacija apie pristatymo kainą ir terminus pateikta puslapyje „Pristatymas ir grąžinimas“.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
      <h1 className="text-4xl text-ink md:text-5xl">Dažniausiai užduodami klausimai</h1>

      <div className="mt-10 border-t border-line">
        {FAQ.map((item) => (
          <details key={item.q} className="group border-b border-line py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl text-ink [&::-webkit-details-marker]:hidden">
              {item.q}
              <span aria-hidden="true" className="text-2xl leading-none text-muted group-open:hidden">+</span>
              <span aria-hidden="true" className="hidden text-2xl leading-none text-muted group-open:inline">−</span>
            </summary>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>

      <p className="mt-10 text-muted">
        Neradote atsakymo?{" "}
        <Link href="/contact" className="text-ink underline underline-offset-4 hover:text-brand">
          Parašykite mums
        </Link>
        . Informacija apie pristatymą:{" "}
        <Link href="/delivery" className="text-ink underline underline-offset-4 hover:text-brand">
          Pristatymas ir grąžinimas
        </Link>
        .
      </p>
    </div>
  );
}
