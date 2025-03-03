import Banner from "@/components/hero/Banner";


export default function Home() {
  return (
    <main>
      <Banner />

      {/* Rest of the page content would go here */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            TRUSTED BY THE WORLD'S LEADING ORGANIZATIONS
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-8 items-center">
            {/* Placeholder for company logos */}
            <div className="h-8 w-24 bg-slate-100 rounded"></div>
            <div className="h-8 w-24 bg-slate-100 rounded"></div>
            <div className="h-8 w-24 bg-slate-100 rounded"></div>
            <div className="h-8 w-24 bg-slate-100 rounded"></div>
            <div className="h-8 w-24 bg-slate-100 rounded"></div>
          </div>
        </div>

        <div className="mt-16">
          <div className="relative">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Find your next hackathon"
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 pr-10"
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-4 py-2 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search hackathons
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

