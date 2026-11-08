export default function SiteLoading() {
  return (
    <main className="min-h-screen bg-[#f3ece3]" aria-label="Loading page" aria-busy="true">
      <div className="h-20 border-b border-[#d2c0ac] bg-[#f8f2e9]" />
      <div className="mx-auto grid min-h-[520px] max-w-[1600px] animate-pulse lg:grid-cols-2">
        <div className="flex items-center px-8 py-20 lg:px-20">
          <div className="w-full max-w-xl space-y-5">
            <div className="h-3 w-44 bg-[#d8c5b0]" />
            <div className="h-20 w-4/5 bg-[#e4d5c5]" />
            <div className="h-4 w-full bg-[#e4d5c5]" />
            <div className="h-4 w-3/4 bg-[#e4d5c5]" />
          </div>
        </div>
        <div className="min-h-[360px] bg-[#ddcdbb]" />
      </div>
    </main>
  );
}
