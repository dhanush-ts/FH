export default function ProfileSkeleton({ type = "basic-info" }) {
    switch (type) {
      case "basic-info":
        return (
          <div className="w-full overflow-hidden border-none shadow-lg rounded-lg bg-white dark:bg-gray-800">
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        )
  
      case "additional-info":
        return (
          <div className="w-full overflow-hidden border-none shadow-lg rounded-lg bg-white dark:bg-gray-800">
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
  
      case "education":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="animate-pulse space-y-12">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-40 bg-gray-100 dark:bg-gray-800 rounded-xl ${i % 2 === 0 ? "ml-0 md:ml-[10%]" : "ml-0 md:mr-[10%]"}`}
                />
              ))}
            </div>
          </div>
        )
  
      case "projects":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        )
  
      case "achievements":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        )
  
      case "user-info":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        )
  
      default:
        return <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
    }
  }
  
  