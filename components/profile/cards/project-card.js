"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardFooter } from "@/components/ui/card"
import { ExpandableText } from "@/components/ui/expandable-text"
import { Calendar, Clock, CheckCircle2, Globe, Github, ExternalLink } from "lucide-react"

// Format date to display in a more readable format
const formatDate = (dateString) => {
  if (!dateString) return "Present"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
}

// Get project duration in months
const getProjectDuration = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()

  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())

  if (months < 1) return "< 1 month"
  if (months === 1) return "1 month"
  return `${months} months`
}

// Get project status
const getProjectStatus = (endDate) => {
  if (!endDate) return "active"
  return "completed"
}

export function ProjectCard({ project }) {
  return (
    <Card className="overflow-hidden border-green-200 dark:border-green-700 shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="relative flex-grow">
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

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 pr-24">{project.title}</h3>

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

          <ExpandableText text={project.description} maxLines={3} />
        </div>
      </div>

      {/* Footer with link */}
      {project.link && (
        <CardFooter className="p-4 pt-2 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
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
        </CardFooter>
      )}
    </Card>
  )
}

