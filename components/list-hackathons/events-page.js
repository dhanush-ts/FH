import { HackathonFilters } from "@/components/list-hackathons/hackathon-filters"
import { HackathonList } from "@/components/list-hackathons/hackathon-list"
import { SearchInput } from "@/components/list-hackathons/search-input"
import { Pagination } from "@/components/list-hackathons/pagination"
import serverSideFetch from "@/app/service"

export default async function EventsPage({
  searchParams,
}) {
    const { page, status, type, mode, is_team_event, registration_cost, query } = (await searchParams)
  // Extract search parameters with defaults
  const pagef = typeof page === 'string' ? parseInt(page) : 1
  const statusf = typeof status === 'string' ? status : undefined
  const typef = typeof type === 'string' ? type : undefined
  const modef = typeof mode === 'string' ? mode : undefined
  const isTeamEventf = typeof is_team_event === 'string' ? is_team_event === 'true' : undefined
  const registrationCostf = typeof registration_cost === 'string' ? registration_cost === 'true' : undefined
  const queryf = typeof query === 'string' ? query : undefined

  async function fetchEvents(params) {

      // Build the query URL with only defined parameters
      const queryParams = new URLSearchParams()
  
      // Always include page parameter
      queryParams.set("page", params?.pagef?.toString())
  
      // Only add other parameters if they are defined
      if (params.statusf) queryParams.set("status", params.statusf)
      if (params.typef) queryParams.set("type", params.typef)
      if (params.modef) queryParams.set("mode", params.modef)
      if (params.is_team_event !== undefined) queryParams.set("is_team_event", params.is_team_event?.toString())
      if (params.registration_cost !== undefined)
        queryParams.set("registration_cost", params.registration_cost?.toString())
      if (params.queryf) queryParams.set("query", params.queryf)
  
      const apiUrl = `/event/list/?${queryParams?.toString()}`
  
      // In a real app, we would use the full URL
      // const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/event/list/?${queryParams.toString()}`
  
      // For demo purposes, we'll simulate a fetch using the provided mock data
      // Replace this with a real fetch in production
      const response = await serverSideFetch(apiUrl)
  
      return response
  }

  // Fetch events data
  const eventsData = await fetchEvents({
    pagef,
    statusf,
    typef,
    modef,
    is_team_event: isTeamEventf,
    registration_cost: registrationCostf,
    queryf
  })

  return (
    <div className="container mx-auto py-8 pb-32 px-8">
      <div className="flex flex-col gap-6">
        
        <div className="w-full max-w-3xl mx-auto mb-8">
          <SearchInput defaultValue={query} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <HackathonFilters 
              currentFilters={{
                statusf,
                typef,
                modef,
                is_team_event: isTeamEventf,
                registration_cost: registrationCostf
              }}
            />
          </div>
          
          <div className="md:w-3/4">
            {eventsData.error ? (
              <div className="bg-white dark:bg-gray-900 rounded-lg p-8 text-center shadow-md">
                <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">No Results Found</h2>
                <p className="text-gray-700 dark:text-gray-300">Try adjusting your filters to find more events.</p>
              </div>
            ) : (
              <>
                <HackathonList events={eventsData.results} />
                
                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={Math.ceil((eventsData.count || 0) / 20)}
                    hasNextPage={eventsData.next}
                    hasPrevPage={eventsData.previous}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
