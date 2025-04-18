import { Github, Linkedin, Globe, Plus } from "lucide-react"
import Link from "next/link"
// import { Button } from "./button"

export function ProfileSocialLinks({ githubUrl, linkedinUrl, websiteUrl }) {
  if (!githubUrl && !linkedinUrl && !websiteUrl) return (
    <Link
      href="/profile/settings"
      className="hover:bg-gray-100 w-fit transition rounded-md flex items-center gap-2 text-sm"
      >
      <Plus className="w-4 h-4" />Add Social links
              </Link>
  );

  return (
    <div className="flex space-x-3 justify-center md:justify-start">
      {githubUrl && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-md text-green-600 hover:border-2 hover:p-1 hover:border-green-600 hover:bg-green-50 transition-colors duration-300"
          aria-label="GitHub Profile"
        >
          <Github className="h-5 w-5" />
        </a>
      )}

      {linkedinUrl && (
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition-colors duration-300 hover:border-2 hover:p-1 hover:border-green-600"
          aria-label="LinkedIn Profile"
        >
          <Linkedin className="h-5 w-5" />
        </a>
      )}

      {websiteUrl && (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition-colors duration-300 hover:border-2 hover:p-1 hover:border-green-600"
          aria-label="Personal Website"
        >
          <Globe className="h-5 w-5" />
        </a>
      )}
    </div>
  )
}

