export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14" aria-busy="true" aria-label="Kraunama">
      <div className="h-12 w-56 bg-line" />
      <div className="mt-3 h-5 w-80 max-w-full bg-line/60" />
      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] bg-line" />
            <div className="mt-4 h-6 w-3/4 bg-line/60" />
            <div className="mt-2 h-4 w-1/3 bg-line/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
