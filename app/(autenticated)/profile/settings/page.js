
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ProfileSettingsContent from "@/components/profile/settings/profile"
import ProfileSettingsSidebar from "@/components/profile/settings/sidebar"

export const metadata = {
  title: "Profile Settings | Edit Your Profile",
  description: "Update your profile information, education, projects and achievements",
}

export default function ProfileSettingsPage() {
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
            href="/profile"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <ProfileSettingsSidebar />
          </div>

          <div className="w-full md:w-3/4">
            <ProfileSettingsContent />
          </div>
        </div>
      </div>
    </main>
  )
}

