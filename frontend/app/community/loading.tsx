export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          {/* Hero section skeleton */}
          <div className="text-center mb-12">
            <div className="h-12 bg-slate-800 rounded w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-slate-800 rounded w-2/3 mx-auto"></div>
          </div>

          {/* Tabs skeleton */}
          <div className="bg-slate-900 rounded-lg p-1 mb-6">
            <div className="grid grid-cols-4 gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-800 rounded"></div>
              ))}
            </div>
          </div>

          {/* Search filters skeleton */}
          <div className="bg-slate-900 rounded-lg p-6 mb-8 border border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 h-10 bg-slate-800 rounded"></div>
              <div className="h-10 bg-slate-800 rounded"></div>
              <div className="h-10 bg-slate-800 rounded"></div>
            </div>
          </div>

          {/* Cards skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-900 border-slate-800 rounded-lg p-6"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-slate-800 rounded mb-2"></div>
                    <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                  </div>
                  <div className="h-6 bg-slate-800 rounded w-12"></div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="h-6 bg-slate-800 rounded w-16"></div>
                    <div className="h-6 bg-slate-800 rounded w-20"></div>
                  </div>
                  <div className="h-12 bg-slate-800 rounded"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-slate-800 rounded w-24"></div>
                    <div className="h-4 bg-slate-800 rounded w-20"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-10 bg-slate-800 rounded flex-1"></div>
                    <div className="h-10 w-10 bg-slate-800 rounded"></div>
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
