import Link from 'next/link';
import { CONTACT_EMAIL, CONTACT_HOURS, CONTACT_PHONE } from '../lib/site';
import Wordmark from './Wordmark';

const linkClass = 'text-surface/75 transition-colors hover:text-surface';

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-1">
          <Wordmark className="!text-surface [&_svg]:!text-surface" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-surface/70">
            Tradicinis lietuviškas obuolių sūris: klasikinis, su čili, riešutais, medumi ir cinamonu.
          </p>
        </div>

        <nav aria-label="Parduotuvė" className="text-sm">
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-surface/50">Parduotuvė</p>
          <ul className="space-y-3">
            <li><Link href="/products" className={linkClass}>Visi produktai</Link></li>
            <li><Link href="/products?category=singles" className={linkClass}>Pavieniai</Link></li>
            <li><Link href="/products?category=gift_sets" className={linkClass}>Dovanų rinkiniai</Link></li>
          </ul>
        </nav>

        <nav aria-label="Informacija" className="text-sm">
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-surface/50">Informacija</p>
          <ul className="space-y-3">
            <li><Link href="/about" className={linkClass}>Mūsų istorija</Link></li>
            <li><Link href="/delivery" className={linkClass}>Pristatymas ir grąžinimas</Link></li>
            <li><Link href="/faq" className={linkClass}>DUK</Link></li>
            <li><Link href="/credits" className={linkClass}>Nuotraukų autoriai</Link></li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-surface/50">Kontaktai</p>
          <ul className="space-y-3 text-surface/75">
            <li>{CONTACT_EMAIL}</li>
            <li>{CONTACT_PHONE}</li>
            <li>{CONTACT_HOURS}</li>
            <li><Link href="/contact" className="underline underline-offset-4 hover:text-surface">Parašykite mums</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-surface/15 px-4 py-5 text-center text-xs text-surface/55">
        © {new Date().getFullYear()} Obuolių sūris. Portfolio projektas: tikri užsakymai nevykdomi.
      </div>
    </footer>
  );
}
