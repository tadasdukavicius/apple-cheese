import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-medium text-ink mb-3">Puslapis nerastas</h1>
        <p className="text-muted mb-6">
          Nepavyko rasti to, ko ieškote.
        </p>
        <Link
          href="/products"
          className="btn-primary"
        >
          Peržiūrėti produktus
        </Link>
      </div>
    </div>
  );
}
