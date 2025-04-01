import { Suspense } from "react"
import { Tabs } from "@/components/ui/tabs"
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
        <div className="w-full relative rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 bg-green-100">
          <p className="mb-4">Education</p>
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
        <div className="w-full relative rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 bg-green-100">
          <p className="mb-4">Projects</p>
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
        <div className="w-full relative rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 bg-green-100">
          <p className="mb-4">Achievements</p>
          <Suspense fallback={<ProfileSkeleton type="achievements" />}>
            <Achievements />
          </Suspense>
        </div>
      ),
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
      <Suspense
        fallback={
          <div className="h-[200px] sm:h-[250px] md:h-[300px] bg-gradient-to-r from-blue-500 to-blue-300 animate-pulse" />
        }
      >
        <Banner2 />
      </Suspense>

      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        <div className="w-full mx-auto my-4 sm:my-6 md:my-8 lg:my-10">
          <Tabs
            tabs={tabs}
            containerClassName="mb-4 sm:mb-6 md:mb-8"
            tabClassName="text-sm sm:text-base md:text-lg font-medium"
          />
        </div>
      </div>
    </main>
  )
}

