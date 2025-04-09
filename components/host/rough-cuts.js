// import Image from "next/image"
// import Link from "next/link"
// import { Badge } from "@/components/ui/badge"
// import serverSideFetch from "@/app/service"

// const getVerificationStatusColor = (status) => {
//   switch (status.toLowerCase()) {
//     case "accepted":
//       return "bg-green-500 text-white"
//     case "rejected":
//       return "bg-red-500 text-white"
//     case "pending":
//       return "bg-yellow-500 text-white"
//     default:
//       return "bg-gray-500 text-white"
//   }
// }

// const getPublishedStatusColor = (isPublished) => {
//   return isPublished ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
// }

// export default async function RoughCutsPage() {
//   let events = []
//   try {
//     events = await serverSideFetch("/event/organizer/base-event/", {
//       next: { revalidate: 60 },
//     })
//   } catch (error) {
//     console.error("Error fetching events:", error)
//   }

//   return (
//     <main className="py-10 px-4 mx-auto">

//       <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//         {events.length > 0 ? (
//           events.map((event) => (
//             <Link
//               key={event.id}
//               href={`/host/create/${event.id}`}
//               className="block w-full h-[280px] transition-shadow rounded-lg border bg-white dark:bg-gray-950 hover:shadow-md overflow-hidden relative"
//             >
//               <div className="absolute top-0 right-0 z-10">
//                 <div
//                   className={`px-1.5 py-0.5 rounded-tr-md rounded-bl-md text-xs font-medium ${getVerificationStatusColor(
//                     event.verification_status
//                   )}`}
//                 >
//                   {event.verification_status}
//                 </div>
//               </div>

//               {/* Logo image box */}
//               <div className="h-28 w-full flex items-center justify-center border-b bg-gray-100 dark:bg-gray-800">
//                 <div className="h-20 w-20 relative">
//                   <Image
//                     src={
//                       event.logo?.replace("localhost", "127.0.0.1") ||
//                       "/placeholder.svg"
//                     }
//                     alt={`${event.title} logo`}
//                     fill
//                     className="object-cover rounded-md"
//                     sizes="80px"
//                     loading="lazy"
//                   />
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="p-4 flex flex-col justify-between h-[calc(100%-7rem)]">
//                 <div>
//                   <h2 className="font-semibold text-md line-clamp-1 mb-1">
//                     {event.title}
//                   </h2>
//                   <p className="text-sm text-muted-foreground line-clamp-2">
//                     {event.short_description}
//                   </p>
//                 </div>
//                 <div className="mt-4">
//                   <Badge
//                     className={`px-2 py-0.5 text-[10px] font-medium rounded ${getPublishedStatusColor(
//                       event.is_published
//                     )}`}
//                   >
//                     {event.is_published ? "Published" : "Draft"}
//                   </Badge>
//                 </div>
//               </div>
//             </Link>
//           ))
//         ) : (
//           <div className="col-span-full text-center py-12">
//             <h3 className="text-xl font-medium text-muted-foreground">
//               No hackathon events found
//             </h3>
//             <p className="mt-2">Create your first hackathon to get started</p>
//           </div>
//         )}
//       </div>
//     </main>
//   )
// }

import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import serverSideFetch from "@/app/service"

const getVerificationStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "accepted":
      return "bg-green-500 text-white"
    case "rejected":
      return "bg-red-500 text-white"
    case "pending":
      return "bg-yellow-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

const getPublishedStatusColor = (isPublished) => {
  return isPublished ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
}

export default async function RoughCutsPage() {
  let events = []
  try {
    events = await serverSideFetch("/event/organizer/base-event/", {
      next: { revalidate: 60 },
    })
  } catch (error) {
    console.error("Error fetching events:", error)
  }

  return (
    <main className="py-10 w-full px-4 mx-auto">

      <div className="w-full grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events.length > 0 ? (
          events.map((event) => (
            <Link
              key={event.id}
              href={`/host/create/${event.id}`}
              className="group block w-full h-[160px] rounded-xl border bg-white dark:bg-gray-950 hover:shadow-lg transition-all relative overflow-hidden"
            >
              {/* Small Logo top-left as badge */}
              <div className="absolute top-4 left-4 z-10 h-12 w-12 rounded-md overflow-hidden border bg-white dark:bg-gray-900 shadow-sm">
                <Image
                  src={event.logo?.replace("localhost", "127.0.0.1") || "/placeholder.svg"}
                  alt={`${event.title} logo`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>

              {/* Verification badge top-right */}
              <div className="absolute top-0 right-0 z-10">
                <div
                  className={`px-2 py-0.5 rounded-tr rounded-bl text-xs font-semibold ${getVerificationStatusColor(
                    event.verification_status
                  )}`}
                >
                  {event.verification_status}
                </div>
              </div>

              {/* Content */}
              <div className="flex h-full pl-20 pr-4 py-4">
                <div className="flex flex-col justify-between w-full">
                  <div>
                    <h2 className="font-semibold text-lg line-clamp-1 mb-1">
                      {event.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.short_description}
                    </p>
                  </div>
                  <div className="mt-2">
                    <Badge
                      className={`px-2 py-0.5 text-[10px] font-medium rounded ${getPublishedStatusColor(
                        event.is_published
                      )}`}
                    >
                      {event.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium text-muted-foreground">
              No hackathon events found
            </h3>
            <p className="mt-2">Create your first hackathon to get started</p>
          </div>
        )}
      </div>
    </main>
  )
}
