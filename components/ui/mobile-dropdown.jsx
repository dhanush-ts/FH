"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { ProfileSkillTags } from "./profile-skill"

export function MobileDropdown({ bio, skills }) {
  const [isOpen, setIsOpen] = useState(false)

  // If there's no bio and no skills, don't render the dropdown
  if (!bio && (!skills || skills.length === 0)) {
    return null
  }

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 font-medium"
      >
        <span>View Bio & Skills</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div className="p-4 bg-white">
          {bio && <p className="text-gray-600 italic mb-4">{bio}</p>}

          {skills && skills.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
              <ProfileSkillTags skills={skills} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

