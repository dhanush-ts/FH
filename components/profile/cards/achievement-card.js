"use client"

import { Trophy, Calendar, Link2, Award, Medal, Star, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ExpandableText } from "@/components/ui/expandable-text"

const formatDate = (dateString) => {
  if (!dateString) return "No date specified"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

const getAchievementIcon = (id) => {
  const icons = [Trophy, Medal, Award, Star]
  const index = id % icons.length
  return icons[index]
}

export function AchievementCard({ achievement, index }) {
  const AchievementIcon = getAchievementIcon(index)

  return (
    <Card className="h-full overflow-hidden border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600/50 transition-all duration-300 shadow-md hover:shadow-lg">
      <div className="relative">
        {/* Achievement icon badge */}
        <div className="absolute -top-4 -left-4 z-10">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
            <AchievementIcon className="h-8 w-8 text-white" />
          </div>
        </div>

        <CardHeader className="pt-6 pb-2 pr-14">
          <div className="flex flex-col ml-10">
            <h3 className="text-lg font-bold min-h-[3.5rem]">{achievement.title}</h3>

            {achievement.date_received && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                <Calendar className="h-3.5 w-3.5 mr-1 text-green-600" />
                <span>{formatDate(achievement.date_received)}</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <ExpandableText text={achievement.description} maxLines={4} />

          {achievement.link && (
            <div className="mt-4">
              <a
                href={achievement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
              >
                <Link2 className="h-3.5 w-3.5 mr-1.5" />
                View Certificate
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  )
}

