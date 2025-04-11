"use client"
import { usePathname, useRouter } from "next/navigation"
import { CircularProgressIndicator } from "@/components/ui/circular-progress"
import { Button } from "@/components/ui/button"
import { ChevronRight, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Section definitions with their weightage
const SECTIONS = [
  { id: "basic", name: "Basic Details", weight: 25, path: "" },
  { id: "additional", name: "Additional Details", weight: 15, path: "additional" },
  { id: "media", name: "Media", weight: 15, path: "media" },
  { id: "sponsors", name: "Sponsors & Prizes", weight: 20, path: "sponsors" },
  { id: "schedule", name: "Schedule", weight: 15, path: "schedule" },
  { id: "venue", name: "Venue", weight: 10, path: "venue" },
]

export function ProgressSidebar({ eventId }) {
  const router = useRouter()
  const pathname = usePathname()


  const handleSectionClick = (sectionId, path) => {
    router.push(`/host/create/${eventId}/${path}`)
  }

  return (
    <aside className="w-full md:w-80 border rounded-md shadow-md h-fit mr-24">
      <div className="flex flex-col p-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Event Progress</h2>
          <CircularProgressIndicator value={20} size={48} strokeWidth={4} className="text-primary" />
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            {SECTIONS.map((section, index) => {
              const progress = 110
              const isActive = pathname === `/host/create/${eventId}/${section.path}` || pathname === `/host/create/${eventId}` && section.id==="basic"
              const isCompleted = progress === 100

              return (
                <li key={section.id}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-between px-3 py-2 text-left",
                      isActive && "bg-primary/10 text-primary hover:bg-primary/20",
                      isCompleted && !isActive && "text-green-600",
                    )}
                    onClick={() => handleSectionClick(section.id, section.path)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border">
                        {isCompleted ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="text-xs">{index + 1}</span>
                        )}
                      </div>
                      <span>{section.name}</span>
                    </div>

                    <div className="flex items-center">
                      {progress > 0 && progress < 100 && (
                        <span className="mr-2 text-xs text-muted-foreground">{progress}%</span>
                      )}
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </div>
                  </Button>

                  {index < SECTIONS.length - 1 && <div className="ml-6 h-6 w-px mx-auto bg-border"></div>}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="mt-6 rounded-lg bg-muted p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <h4 className="font-medium">Save Progress</h4>
              <p className="text-sm text-muted-foreground">
                Your changes are saved automatically when you move between sections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}