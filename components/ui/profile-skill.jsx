import { Plus } from "lucide-react"
import Link from "next/link"

export function ProfileSkillTags({ skills }) {

  return (
    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
      {skills.length===0 &&
        <Link
          href="/profile/settings"
          className="hover:bg-gray-100 w-fit transition rounded-md flex items-center gap-2 text-sm"
          >
          <Plus className="w-4 h-4" />
          Add Skills
        </Link>
      }
      {skills.map((skill, index) => (
        <div
          key={index}
          className="px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 shadow-sm"
        >
          {skill}
        </div>
      ))}
    </div>
  );
}