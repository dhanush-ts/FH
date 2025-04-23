export const dynamic = "force-dynamic";
import CreateHackathonButton from "@/components/host/create-popup"
import RoughCuts from "@/components/host/rough-cuts"

export const metadata = {
  title: "FindHacks | Host Hackathons",
  description:
    "Create and manage your hackathon events. Customize event details, set dates, and invite participants. Streamline the process of hosting hackathons with our user-friendly platform.",
  keywords: [
    "host hackathons",
    "hackathon management",
    "event details",
    "hackathon dates",
    "invite participants",
    "hackathon platform",
    "hackathon events",
    "hackathon organization",
  ],
  openGraph: {
    title: "FindHacks | Host Hackathons",
    description: "Create and manage your hackathon events with our user-friendly platform.",
    type: "website",
    url: "https://findhacks.com/host",
  },
}

export default function HostHacks() {
  return (
    <div className="bg-gray-100 py-24 min-h-screen overflow-hidden px-8">
      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-5xl text-center font-bold">Kick off a hackathon!</h1>
        <p className="text-gray-600 text-sm md:text-xl max-w-2xl my-12 text-center">
          Bring your hackathon vision to life with Find Hacks.
          <br />
          From streamlining entries to coordinating judging, we've got everything you need to host a seamless and
          impactful event.
        </p>
        <CreateHackathonButton />
      </div>
      <div className="w-full flex flex-col items-center justify-center mt-18">
        <h1 className="font-semibold text-2xl md:text-4xl text-left">My Mockups</h1>
        <RoughCuts />
      </div>
    </div>
  )
}
