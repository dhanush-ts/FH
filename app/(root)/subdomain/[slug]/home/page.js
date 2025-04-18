import serverSideFetch from "@/app/service";

// app/[slug]/metadata.js
export async function generateMetadata({ params }) {
  const slug = params.slug;

  const data = await serverSideFetch(`/event/${slug}`);
  console.log(data)
  const event = data.base_event;

  return {
    title: event.title,
    description: event.short_description,
    openGraph: {
      title: event.title,
      description: event.short_description,
      images: [event.logo],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.short_description,
      images: [event.logo],
    },
    icons: {
      icon: event.logo, // PNG, JPEG, SVG supported
    },
  };
}



export default async function HackHomePage({params}) {
  const { slug } = (await params)

  return <div className="h-screen">Welcome to {slug}'s Hackathon!</div>
}
