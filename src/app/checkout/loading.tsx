export default function CheckoutLoading() {
  return (
    <main className="min-h-screen bg-[#f7f0e6] px-6 py-28" aria-label="Loading checkout" aria-busy="true">
      <div className="mx-auto grid max-w-5xl animate-pulse gap-10 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          <div className="h-8 w-48 bg-[#e4d5c5]" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-12 bg-[#eadfd3]" />
          ))}
          <div className="h-14 bg-[#d8c19d]" />
        </div>
        <div className="h-96 bg-[#eadfd3] lg:col-span-2" />
      </div>
    </main>
  );
}
