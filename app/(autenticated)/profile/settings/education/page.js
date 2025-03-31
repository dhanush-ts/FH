
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ProfileSettingsSidebar from "@/components/profile/settings/sidebar"
import EducationSettingsForm from "@/components/profile/settings/education"

export const metadata = {
  title: "Education Settings | Edit Your Education",
  description: "Update your education information",
}

export default function EducationSettingsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-primary text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Edit your settings</h1>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="mb-6 px-4">
          <Link
            href="/profile/settings"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <ProfileSettingsSidebar activeItem="education" />
          </div>

          <div className="w-full md:w-3/4">
            <EducationSettingsForm />
          </div>
        </div>
      </div>
    </main>
  )
}

