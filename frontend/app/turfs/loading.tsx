export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          {/* Search filters skeleton */}
          <div className="bg-slate-900 rounded-lg p-6 mb-8 border border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2 h-10 bg-slate-800 rounded"></div>
              <div className="h-10 bg-slate-800 rounded"></div>
              <div className="h-10 bg-slate-800 rounded"></div>
              <div className="h-10 bg-slate-800 rounded"></div>
              <div className="h-10 bg-slate-800 rounded"></div>
            </div>
          </div>

          {/* Results header skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-slate-800 rounded w-48"></div>
            <div className="h-10 bg-slate-800 rounded w-48"></div>
          </div>

          {/* Turf cards skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-900 border-slate-800 rounded-lg overflow-hidden"
              >
                <div className="h-48 bg-slate-800"></div>
                <div className="p-6">
                  <div className="h-6 bg-slate-800 rounded mb-2"></div>
                  <div className="h-4 bg-slate-800 rounded mb-4 w-3/4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-slate-800 rounded w-16"></div>
                    <div className="h-6 bg-slate-800 rounded w-16"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-8 bg-slate-800 rounded w-20"></div>
                    <div className="h-10 bg-slate-800 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
