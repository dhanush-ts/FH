"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, GraduationCap, Briefcase, Trophy } from "lucide-react"

export default function ProfileSettingsSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      id: "profile",
      label: "Profile info",
      href: "/profile/settings",
      icon: <User className="h-4 w-4 mr-2" />,
    },
    {
      id: "education",
      label: "Education",
      href: "/profile/settings/education",
      icon: <GraduationCap className="h-4 w-4 mr-2" />,
    },
    {
      id: "projects",
      label: "Projects",
      href: "/profile/settings/projects",
      icon: <Briefcase className="h-4 w-4 mr-2" />,
    },
    {
      id: "achievements",
      label: "Achievements",
      href: "/profile/settings/achievements",
      icon: <Trophy className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-2 border-green-200 dark:border-green-700 shadow-md">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase">
        Profile Settings
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
