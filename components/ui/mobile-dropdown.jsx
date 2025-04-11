"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Plus } from "lucide-react"
import { ProfileSkillTags } from "./profile-skill"
import Link from "next/link"

export function MobileDropdown({ bio, skills }) {
  const [isOpen, setIsOpen] = useState(false)

  const hasBio = Boolean(bio)
  const hasSkills = skills && skills.length > 0

  let missingLabel = ""
  if (!hasBio && !hasSkills) {
    missingLabel = "Add bio & skills"
  } else if (!hasBio) {
    missingLabel = "Add bio"
  } else if (!hasSkills) {
    missingLabel = "Add skills"
  }

  const showAddButton = !hasBio || !hasSkills

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      {showAddButton && (
        <div className="p-2 flex justify-center bg-white">
          <Link
            href="/profile/settings"
            className="hover:bg-gray-100 p-1 border mx-auto w-fit transition rounded-md flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            {missingLabel}
          </Link>
        </div>
      )}

      {(hasBio || hasSkills) && (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 font-medium"
          >
            <span>View Bio & Skills</span>
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {isOpen && (
            <div className="p-4 bg-white">
              {hasBio && <p className="text-gray-600 italic mb-4">{bio}</p>}

              {hasSkills && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
                  <ProfileSkillTags skills={skills} />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
p