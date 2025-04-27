export function BoatListSkeleton() {
  return (
    <div>
      <div className="mb-3 h-9 w-full animate-pulse rounded-md bg-gray-200"></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-md border bg-white shadow-sm">
            <div className="h-32 w-full animate-pulse bg-gray-200"></div>
            <div className="p-3 space-y-2">
              <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200"></div>
              <div className="h-3 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div className="flex items-center justify-between pt-1">
                <div className="h-3 w-1/4 animate-pulse rounded bg-gray-200"></div>
                <div className="h-7 w-20 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
