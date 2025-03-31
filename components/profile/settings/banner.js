import { MapPin, Github, Linkedin, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { fetchProfileData, fetchAdditionalInfo } from "@/lib/data"

export default async function Banner3() {
  const profileData = await fetchProfileData()
  const additionalInfo = await fetchAdditionalInfo()

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-300 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/placeholder.svg?height=400&width=1200')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-white/80 shadow-xl transform hover:scale-105 transition-transform duration-300">
              <Image
                src={profileData?.profile_photo_url || "/placeholder.svg?height=160&width=160"}
                alt="Profile"
                className="h-full w-full object-cover"
                width={160}
                height={160}
                priority
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 shadow-lg" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-blue-400 shadow-lg" />
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {profileData?.first_name} {profileData?.last_name}
            </h1>
            <p className="text-white/80 mt-2">{profileData?.email}</p>

            {/* Location */}
            <div className="flex items-center justify-center md:justify-start mt-2 text-white/90">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Chennai, India</span>
            </div>

            {/* Social links */}
            <div className="flex space-x-3 mt-4 justify-center md:justify-start">
              {additionalInfo?.github_url && (
                <a
                  href={additionalInfo.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-300"
                >
                  <Github className="h-5 w-5 text-white" />
                </a>
              )}

              {additionalInfo?.linkedin_url && (
                <a
                  href={additionalInfo.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-300"
                >
                  <Linkedin className="h-5 w-5 text-white" />
                </a>
              )}

              {additionalInfo?.website_url && (
                <a
                  href={additionalInfo.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-300"
                >
                  <ExternalLink className="h-5 w-5 text-white" />
                </a>
              )}
            </div>

            {additionalInfo?.skills && additionalInfo.skills.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                {additionalInfo.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
                {additionalInfo.skills.length > 4 && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white shadow-sm">
                    +{additionalInfo.skills.length - 4} more
                  </span>
                )}
              </div>
            )}

            <div className="mt-6">
              <Link href="/profile/settings">
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

