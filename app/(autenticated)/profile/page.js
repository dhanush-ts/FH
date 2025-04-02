import { Suspense } from "react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs"
import Banner2 from "@/components/profile/Banner2"
import Projects from "@/components/profile/Projects"
import Achievements from "@/components/profile/Achievements"
import ProfileSkeleton from "@/components/profile/profile-skeleton"
import EducationTimeline from "@/components/profile/Education"

export const metadata = {
  title: "User Profile | Portfolio",
  description: "View professional profile, education, projects and achievements",
}

export default function ProfilePage() {
  const tabs = [
    {
      title: "Education",
      value: "education",
      content: (
        <div className="w-full relative rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800/30">
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-6 flex items-center gap-2">
            <span className="bg-green-100 dark:bg-green-800/30 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
              </svg>
            </span>
            Educational Journey
          </h2>
          <Suspense fallback={<ProfileSkeleton type="education" />}>
            <EducationTimeline />
          </Suspense>
        </div>
      ),
    },
    {
      title: "Projects",
      value: "projects",
      content: (
        <div className="w-full relative rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800/30">
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-6 flex items-center gap-2">
            <span className="bg-green-100 dark:bg-green-800/30 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                <path d="M12 11v6"/>
                <path d="m9 14 3-3 3 3"/>
              </svg>
            </span>
            Project Showcase
          </h2>
          <Suspense fallback={<ProfileSkeleton type="projects" />}>
            <Projects />
          </Suspense>
        </div>
      ),
    },
    {
      title: "Achievements",
      value: "achievements",
      content: (
        <div className="w-full relative rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800/30">
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-6 flex items-center gap-2">
            <span className="bg-green-100 dark:bg-green-800/30 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
            </span>
            Achievement Showcase
          </h2>
          <Suspense fallback={<ProfileSkeleton type="achievements" />}>
            <Achievements />
          </Suspense>
        </div>
      ),
    },
  ]

  return (
    <main className="min-h-screen">
      <Suspense
        fallback={
          <div className="h-[200px] sm:h-[250px] md:h-[300px] bg-gradient-to-r from-green-500 to-green-300 animate-pulse" />
        }
      >
        <Banner2 />
      </Suspense>

      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        <div className="w-full mx-auto my-4 sm:my-6 md:my-8 lg:my-10">
          <Tabs
            tabs={tabs}
            containerClassName="mb-4 sm:mb-6 md:mb-8"
            tabClassName="text-sm sm:text-base md:text-lg font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
            activeTabClassName="bg-green-600 dark:bg-green-700"
          />
        </div>
      </div>
    </main>
  )
}
