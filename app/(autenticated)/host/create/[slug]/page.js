export default async function SlugPage({ params }) {
    const slug = (await params).slug
  
    return (
      <div className="p-6 h-screen">
        <h1 className="text-2xl font-bold">Dynamic Page for: {slug}</h1>
        <p className="mt-2 text-muted-foreground">You are viewing content for the <strong>{slug}</strong> slug.</p>
      </div>
    )
  }