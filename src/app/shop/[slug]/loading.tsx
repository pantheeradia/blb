export default function ProductLoading() {
  return (
    <main aria-busy="true" aria-label="Loading product" className="min-h-screen bg-white px-6 pb-16 pt-36">
      <p role="status" className="sr-only">Loading product details...</p>
      <div aria-hidden="true" className="mx-auto grid max-w-7xl animate-pulse gap-12 motion-reduce:animate-none md:grid-cols-2">
        <div className="aspect-square bg-[#ead9c8]" />
        <div className="space-y-5">
          <div className="h-3 w-28 bg-[#d4c4b0]" />
          <div className="h-10 w-3/4 bg-[#ead9c8]" />
          <div className="h-7 w-24 bg-[#ead9c8]" />
          <div className="h-32 bg-[#ead9c8]" />
          <div className="h-12 bg-[#d4c4b0]" />
          <div className="h-4 w-full bg-[#ead9c8]" />
          <div className="h-4 w-4/5 bg-[#ead9c8]" />
        </div>
      </div>
    </main>
  );
}
