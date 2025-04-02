import { Briefcase, Calendar, Link2, Code, Clock, CheckCircle2, Globe, Github, ExternalLink } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { fetchWithAuth } from "@/lib/api"
import { cookies } from 'next/headers'

// Server-side data fetching function
async function getProjectData() {
    try {
      const cookieStore = await cookies()
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

// Format date to display in a more readable format
const formatDate = (dateString) => {
  if (!dateString) return "Present";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

// Get project duration in months
const getProjectDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

  if (months < 1) return "< 1 month";
  if (months === 1) return "1 month";
  return `${months} months`;
};

// Get project status
const getProjectStatus = (endDate) => {
  if (!endDate) return "active";
  return "completed";
};

export default async function Projects() {
  // Fetch project data server-side
  const projectList = await getProjectData();

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
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projectList.map((project) => (
          <Card 
            key={project.id}
            className="overflow-hidden border-green-200 dark:border-green-700 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative">
              {/* Header with gradient */}
              <div className="p-6 pb-4">
                <div className="flex flex-col">
                  {/* Project status badge - moved to top right */}
                  <div className="absolute top-4 right-4 z-10">
                    {getProjectStatus(project.end_date) === "active" ? (
                      <Badge className="bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-400 hover:bg-green-500/30 border-green-500/30 flex items-center gap-1 px-2.5 py-1">
                        <span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-1"></span>
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-500/20 text-blue-600 dark:bg-blue-500/30 dark:text-blue-400 hover:bg-blue-500/30 border-blue-500/30 flex items-center gap-1 px-2.5 py-1">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 pr-24">
                    {project.title}
                  </h3>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-green-600/70" />
                      <span>
                        {formatDate(project.start_date)} - {formatDate(project.end_date)}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-3.5 w-3.5 mr-1 text-green-600/70" />
                      <span>{getProjectDuration(project.start_date, project.end_date)}</span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Gradient fade for text */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
                </div>
              </div>

              {/* Footer with link */}
              <CardFooter className="p-4 pt-2 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
                  >
                    {project.link.includes("github") ? (
                      <Github className="h-4 w-4 mr-1.5" />
                    ) : (
                      <Globe className="h-4 w-4 mr-1.5" />
                    )}
                    <span className="font-medium">View Project</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                ) : (
                  <div className="flex-1"></div>
                )}
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
