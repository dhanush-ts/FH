import { Trophy } from "lucide-react"
import { cookies } from "next/headers"
import { AchievementCard } from "./cards/achievement-card"

async function getAchievementData() {
  try {
    const cookieStore = cookies()
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
        {achievementList.map((achievement, index) => (
          <AchievementCard key={achievement.id} achievement={achievement} index={index} />
        ))}
      </div>
    </div>
  )
}

