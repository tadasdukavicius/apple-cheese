import Link from 'next/link';

/** Makes it clear to visitors (and reviewers) that this is a portfolio demo, not a real shop. */
export default function DemoBanner() {
  return (
    <div className="bg-ink px-4 py-2 text-center text-xs leading-relaxed text-surface/90">
      <p>
        Demonstracinė parduotuvė: užsakymai nevykdomi, mokėjimas netikras.{' '}
        <Link href="/delivery" className="whitespace-nowrap underline underline-offset-4 hover:text-surface">
          Daugiau
        </Link>
      </p>
    </div>
  );
}
