import { Skeleton } from "@/components/ui/skeleton"

export default function EventSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section Skeleton */}
      <div className="relative m-auto w-full overflow-hidden">
        <Skeleton className="h-[40vh] w-full" />
      </div>

      {/* Event Quick Info Skeleton */}
      <div className="bg-green-700 py-6 text-white shadow-lg">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full bg-green-600" />
              <div>
                <Skeleton className="h-4 w-20 bg-green-600" />
                <Skeleton className="mt-1 h-5 w-32 bg-green-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container px-2 py-12 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar Skeleton */}
          <div className="w-full lg:w-1/4">
            <div className="rounded-xl border border-green-200 bg-white px-4 py-2 shadow-lg">
              <Skeleton className="mb-2 h-6 w-32" />
              <div className="flex flex-col gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Content Sections Skeleton */}
          <div className="w-full lg:w-3/4">
            <div className="space-y-24">
              {/* Overview Section Skeleton */}
              <div className="scroll-mt-8">
                <Skeleton className="mb-6 h-8 w-32" />
                <div className="rounded-xl border border-green-100 bg-white p-6 shadow-lg">
                  <div className="flex flex-col items-center gap-4 md:flex-row">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div>
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="mt-2 h-4 w-64" />
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>

              {/* Schedule Section Skeleton */}
              <div className="scroll-mt-8">
                <Skeleton className="mb-6 h-8 w-32" />
                <div className="rounded-xl border border-green-100 bg-white p-6 shadow-lg">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="mb-8">
                      <Skeleton className="mb-4 h-6 w-40" />
                      <div className="space-y-4">
                        {[...Array(2)].map((_, j) => (
                          <div key={j} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="mt-2 h-4 w-48" />
                              </div>
                              <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
