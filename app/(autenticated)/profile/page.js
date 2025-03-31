import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Banner2 from "@/components/profile/Banner2"
import Projects from "@/components/profile/Projects"
import Achievements from "@/components/profile/Achievements"
import ProfileSkeleton from "@/components/profile/profile-skeleton"
import EducationTimeline from "@/components/profile/Education"

// export const metadata = {
//   title: "User Profile | Portfolio",
//   description: "View professional profile, education, projects and achievements",
// }

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Suspense fallback={<div className="h-[300px] bg-gradient-to-r from-blue-500 to-blue-300 animate-pulse" />}>
        <Banner2 />
      </Suspense>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="user-info" className="w-full">
          <div className="bg-white dark:bg-gray-800 max-w-3xl mx-auto rounded-lg p-2 shadow-sm mb-6">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger
                value="education"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                Education
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                Achievements
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="education" className="space-y-4 mt-0">
            <Suspense fallback={<ProfileSkeleton type="education" />}>
              <EducationTimeline />
            </Suspense>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4 mt-0">
            <Suspense fallback={<ProfileSkeleton type="projects" />}>
              <Projects />
            </Suspense>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4 mt-0">
            <Suspense fallback={<ProfileSkeleton type="achievements" />}>
              <Achievements />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

