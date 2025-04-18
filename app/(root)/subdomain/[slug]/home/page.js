export default async function HackHomePage({params}) {
  const { slug } = (await params)

  return <div className="h-screen">Welcome to {slug}'s Hackathon!</div>
}
