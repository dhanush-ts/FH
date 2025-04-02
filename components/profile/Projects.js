import { Code } from "lucide-react"
import { cookies } from "next/headers"
import { ProjectCard } from "./cards/project-card"

// Server-side data fetching function
async function getProjectData() {
  try {
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()
    const cookieHeader = allCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ")

    const response = await fetch("http://127.0.0.1:8000/api/user/project/", {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch projects data: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching projects data:", error)
    return []
  }
}

export default async function Projects() {
  // Fetch project data server-side
  const projectList = await getProjectData()

  if (projectList.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-green-300 dark:border-green-700 p-8 text-center shadow-sm">
        <div className="flex justify-center">
          <Code className="h-16 w-16 text-green-500/60 mb-4" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No projects yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Project information will appear here once added.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projectList.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

