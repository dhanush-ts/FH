
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
    <ProfileSettingsContent />
  )
}