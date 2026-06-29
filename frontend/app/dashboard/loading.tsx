export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      
      {/* Header skeleton */}
      <div className="pt-10 pb-6">
        <div className="h-9 w-64 bg-gray-800 rounded-lg animate-pulse mb-3" />
        <div className="h-5 w-96 bg-gray-800 rounded animate-pulse mb-6" />
        <div className="h-4 w-80 bg-gray-800 rounded animate-pulse" />
      </div>

      {/* Card skeletons — one per expected model */}
      {[1, 2].map(i => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-4 animate-pulse">
          <div className="flex justify-between mb-6">
            <div>
              <div className="h-3 w-16 bg-gray-800 rounded mb-2" />
              <div className="h-7 w-32 bg-gray-800 rounded" />
            </div>
            <div className="h-8 w-36 bg-gray-800 rounded-full" />
          </div>
          <div className="border-t border-gray-800 pt-5 grid grid-cols-4 gap-6">
            <div>
              <div className="h-3 w-20 bg-gray-800 rounded mb-2" />
              <div className="h-7 w-24 bg-gray-800 rounded mb-2" />
              <div className="h-1 w-full bg-gray-800 rounded" />
            </div>
            <div>
              <div className="h-3 w-20 bg-gray-800 rounded mb-2" />
              <div className="h-7 w-28 bg-gray-800 rounded" />
            </div>
            <div>
              <div className="h-3 w-16 bg-gray-800 rounded mb-2" />
              <div className="h-7 w-20 bg-gray-800 rounded" />
            </div>
            <div>
              <div className="h-3 w-24 bg-gray-800 rounded mb-2" />
              <div className="h-12 w-full bg-gray-800 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
