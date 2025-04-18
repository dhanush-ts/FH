import Image from "next/image"
import Link from "next/link"
import { MapPin, Pencil, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ProfileSocialLinks } from "../ui/profile-social-links"
import { ProfileSkillTags } from "../ui/profile-skill"
import { MobileDropdown } from "../ui/mobile-dropdown"
import serverSideFetch from "@/app/service"

export async function ProfileBanner() {
  const profileData = await serverSideFetch("/user/additional-info/")
  const basicData = await serverSideFetch("/user/basic-profile/")

  return (
    <div className="w-full bg-white border-gray-200">
      <div className="container mx-auto max-w-5xl px-4 pt-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 lg:h-48 lg:w-48 relative mx-auto md:mx-0">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src={basicData.profile_image_url || "/placeholder.svg?height=112&width=112"}
                alt="Profile"
                className="h-full w-full object-cover"
                width={112}
                height={112}
                priority
              />
            </div>
            {/* Verification badge if needed */}
            {profileData.verified && (
              <div className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-full">
                🔥
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 w-full mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full">
              <div>
                {/* Name and Username */}
                <h1 className="text-2xl font-bold text-gray-800 text-center md:text-left">
                  {basicData.first_name} {basicData.last_name}
                </h1>
                {/* <p className="text-gray-500 text-center md:text-left">@{basicData.username}</p> */}
                
                {/* Location */}
                <div className="flex items-center justify-center md:justify-start mt-2 text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Chennai, India</span>
                </div>
              </div>

              {/* Edit Profile Button */}
              <div className="mt-4 md:mt-0 select-none flex justify-center md:justify-end">
                <Link href="/profile/settings" >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-green-500 cursor-pointer text-green-700 hover:bg-green-50"
                  >
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-4 w-full justify-center flex md:flex-col">
              <ProfileSocialLinks
                githubUrl={profileData.github_url}
                linkedinUrl={profileData.linkedin_url}
                websiteUrl={profileData.website_url}
              />
            </div>

            {/* Desktop: Bio and Skills */}
            <div className="hidden md:block">
              {/* Bio */}
              {profileData.bio && (
                <p className="text-gray-600 mt-4 text-left italic">{profileData.bio}</p>
              )}

              {!profileData.bio && (
                <Link
                  href="/profile/settings"
                  className="hover:bg-gray-100 mt-4 w-fit transition rounded-md flex items-center gap-2 text-sm"
                  >
                  <Plus className="w-4 h-4" />
                  Add bio
                </Link>
              )}

              {/* Skills */}
              <div className="mt-4 select-none">
                <ProfileSkillTags skills={profileData.skills || []} />
              </div>
            </div>

            {/* Mobile: Dropdown for Bio and Skills */}
            <div className="block md:hidden mt-4">
              <MobileDropdown 
                bio={profileData.bio} 
                skills={profileData.skills || []} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
