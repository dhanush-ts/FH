import { Suspense } from "react"
import { Tabs } from "@/components/ui/tab"
import Projects from "@/components/profile/Projects"
import Achievements from "@/components/profile/Achievements"
import ProfileSkeleton from "@/components/profile/profile-skeleton"
import EducationTimeline from "@/components/profile/Education"
import { ProfileBanner } from "@/components/profile/Banner2"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "FindHacks | User Profile",
  description:
    "Explore the user's developer profile showcasing education background, technical projects, and notable achievements. Discover skills, milestones, and professional growth.",
  keywords: [
    "developer portfolio",
    "user profile",
    "education history",
    "tech projects",
    "achievements",
    "software developer",
    "career timeline",
    "frontend backend skills",
  ],
}

export default function ProfilePage() {
  const tabs = [
    {
      title: "Education",
      value: "education",
      content: (
        <section
          aria-labelledby="education-heading"
          className="w-full relative rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800/30"
        >
          <h2
            id="education-heading"
            className="text-xl font-semibold text-green-800 dark:text-green-300 mb-6 flex items-center gap-2"
          >
            <span className="bg-green-100 dark:bg-green-800/30 p-2 rounded-full">
              🎓
            </span>
            Educational Journey
          </h2>
          <Suspense fallback={<ProfileSkeleton type="education" />}>
            <EducationTimeline />
          </Suspense>
        </section>
      ),
    },
    {
      title: "Projects",
      value: "projects",
      content: (
        <section
          aria-labelledby="projects-heading"
          className="w-full relative rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800/30"
        >
          <h2
            id="projects-heading"
            className="text-xl font-semibold text-green-800 dark:text-green-300 mb-6 flex items-center gap-2"
          >
            <span className="bg-green-100 dark:bg-green-800/30 p-2 rounded-full">
              💻
            </span>
            Project Showcase
          </h2>
          <Suspense fallback={<ProfileSkeleton type="projects" />}>
            <Projects />
          </Suspense>
        </section>
      ),
    },
    {
      title: "Achievements",
      value: "achievements",
      content: (
        <section
          aria-labelledby="achievements-heading"
          className="w-full relative rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800/30"
        >
          <h2
            id="achievements-heading"
            className="text-xl font-semibold text-green-800 dark:text-green-300 mb-6 flex items-center gap-2"
          >
            <span className="bg-green-100 dark:bg-green-800/30 p-2 rounded-full">
              🏆
            </span>
            Achievement Highlights
          </h2>
          <Suspense fallback={<ProfileSkeleton type="achievements" />}>
            <Achievements />
          </Suspense>
        </section>
      ),
    },
    ,
    {
      title: "Work Experience",
      value: "work experience",
      content: (
        <section
          aria-labelledby="achievements-heading"
          className="w-full relative rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800/30"
        >
          <h2
            id="achievements-heading"
            className="text-xl font-semibold text-green-800 dark:text-green-300 mb-6 flex items-center gap-2"
          >
            <span className="bg-green-100 dark:bg-green-800/30 p-2 rounded-full">
              🏆
            </span>
            Achievement Highlights
          </h2>
          <Suspense fallback={<ProfileSkeleton type="achievements" />}>
            <Achievements />
          </Suspense>
        </section>
      ),
    },
  ]

  return (
    <main className="min-h-screen" role="main">
      <Suspense
        fallback={
          <div className="bg-gradient-to-r from-green-500 to-green-300 animate-pulse" />
        }
      >
        <ProfileBanner />
      </Suspense>

      <div className="container mx-auto px-4 select-none">
        <header className="w-full mx-auto my-6">
          <Tabs
            tabs={tabs}
            containerClassName="mb-4 sm:mb-6 md:mb-8"
            tabClassName="text-sm sm:text-base md:text-lg font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
            activeTabClassName="bg-green-600 dark:bg-green-700"
          />
        </header>
      </div>
    </main>
  )
}
