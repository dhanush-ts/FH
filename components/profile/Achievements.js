import { Trophy, Calendar, Link2, Award, Medal, Star, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cookies } from "next/headers"

async function getAchievementData() {
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    const cookieHeader = allCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ")

    const response = await fetch("http://127.0.0.1:8000/api/user/achievement/", {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch achievement data: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching achievement data:", error)
    return []
  }
}

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

export default async function Achievements() {
  const achievementList = await getAchievementData()

  if (achievementList.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-green-300 dark:border-green-700 p-8 text-center shadow-sm">
        <div className="flex justify-center">
          <Trophy className="h-16 w-16 text-green-500/60 mb-4" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No achievements yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Achievement information will appear here once added.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievementList.map((achievement, index) => {
          const AchievementIcon = getAchievementIcon(index)

          return (
            <Card
              key={achievement.id}
              className="h-full overflow-hidden border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600/50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <div className="relative">
                {/* Achievement icon badge */}
                <div className="absolute -top-4 -left-4 z-10">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                    <AchievementIcon className="h-8 w-8 text-white" />
                  </div>
                </div>

                <CardHeader className="pt-6 pb-2 pr-14">
                  <div className="flex flex-col ml-10">
                    <h3 className="text-lg font-bold line-clamp-2 min-h-[3.5rem]">{achievement.title}</h3>

                    {achievement.date_received && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-green-600" />
                        <span>{formatDate(achievement.date_received)}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="relative">
                    <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">
                      {achievement.description}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
                  </div>

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
        })}
      </div>
    </div>
  )
}
