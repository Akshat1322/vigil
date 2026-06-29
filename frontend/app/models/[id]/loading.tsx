export default function ModelLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 animate-pulse">
      <div className="h-4 w-32 bg-gray-800 rounded mt-6 mb-8" />
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-6">
        <div className="flex justify-between">
          <div>
            <div className="h-3 w-16 bg-gray-800 rounded mb-2" />
            <div className="h-8 w-40 bg-gray-800 rounded mb-2" />
            <div className="h-4 w-56 bg-gray-800 rounded" />
          </div>
          <div className="text-right">
            <div className="h-3 w-24 bg-gray-800 rounded mb-2 ml-auto" />
            <div className="h-12 w-20 bg-gray-800 rounded mb-2 ml-auto" />
          </div>
        </div>
      </div>
      {[1,2,3,4].map(i => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-3">
          <div className="flex justify-between">
            <div className="h-5 w-48 bg-gray-800 rounded" />
            <div className="h-5 w-32 bg-gray-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
