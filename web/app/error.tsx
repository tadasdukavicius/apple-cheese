'use client';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-medium text-ink mb-3">Kažkas nepavyko</h1>
        <p className="text-muted mb-6">
          Nepavyko įkelti šio puslapio. Patikrinkite ryšį ir bandykite dar kartą.
        </p>
        <button
          onClick={reset}
          className="btn-primary"
        >
          Bandyti dar kartą
        </button>
      </div>
    </div>
  );
}
