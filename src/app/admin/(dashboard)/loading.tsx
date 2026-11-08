export default function AdminLoading() {
  return (
    <div className="animate-pulse p-8" aria-label="Loading admin data" aria-busy="true">
      <div className="mb-8 h-8 w-48 rounded bg-gray-800" />
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 rounded border border-gray-800 bg-gray-900" />
        ))}
      </div>
      <div className="h-80 rounded border border-gray-800 bg-gray-900" />
    </div>
  );
}
