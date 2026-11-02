export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-[#f3ece3]" aria-label="Loading shop" aria-busy="true">
      <div className="h-20 bg-[#f8f2e9]" />
      <div className="mx-auto max-w-[1440px] animate-pulse px-6 py-14">
        <div className="mb-12 h-52 bg-[#e4d5c5]" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index}>
              <div className="aspect-[5/5.35] bg-[#e2d3c2]" />
              <div className="mt-4 h-3 w-1/3 bg-[#d4c0aa]" />
              <div className="mt-3 h-7 w-3/4 bg-[#e2d3c2]" />
              <div className="mt-6 h-10 bg-[#e2d3c2]" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
