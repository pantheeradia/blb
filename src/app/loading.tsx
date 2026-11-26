export default function SiteLoading() {
  return (
    <main className="min-h-screen bg-white" aria-label="Loading page" aria-busy="true">
      <p role="status" className="sr-only">Loading page...</p>
      <div className="h-20 border-b border-[#d2c0ac] bg-[#f8f2e9]" />
      <div aria-hidden="true" className="mx-auto grid min-h-[480px] max-w-[1600px] animate-pulse motion-reduce:animate-none md:h-[66dvh] md:min-h-[480px] md:max-h-[680px] lg:grid-cols-2">
        <div className="flex items-center px-8 py-10 lg:px-20">
          <div className="w-full max-w-xl space-y-5">
            <div className="h-3 w-44 bg-[#d8c5b0]" />
            <div className="h-20 w-4/5 bg-[#e4d5c5]" />
            <div className="h-4 w-full bg-[#e4d5c5]" />
            <div className="h-4 w-3/4 bg-[#e4d5c5]" />
          </div>
        </div>
        <div className="hidden bg-[#ddcdbb] lg:block" />
      </div>
    </main>
  );
}
