"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Filter, RefreshCw } from "lucide-react"
import { useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

export function HackathonFilters({ currentFilters }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const [filters, setFilters] = useState({
    status: currentFilters.status,
    type: currentFilters.type,
    mode: currentFilters.mode,
    is_team_event: currentFilters.is_team_event,
    registration_cost: currentFilters.registration_cost,
  })

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)

    // Only add parameters if they are defined
    if (filters.status) {
      params.set("status", filters.status)
    } else {
      params.delete("status")
    }

    if (filters.type) {
      params.set("type", filters.type)
    } else {
      params.delete("type")
    }

    if (filters.mode) {
      params.set("mode", filters.mode)
    } else {
      params.delete("mode")
    }

    if (filters.is_team_event !== undefined) {
      params.set("is_team_event", String(filters.is_team_event))
    } else {
      params.delete("is_team_event")
    }

    if (filters.registration_cost !== undefined) {
      params.set("registration_cost", String(filters.registration_cost))
    } else {
      params.delete("registration_cost")
    }

    // Reset to first page when filters change
    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    setFilters({})

    // Keep only the query parameter if it exists
    const query = searchParams.get("query")
    const params = new URLSearchParams()

    if (query) {
      params.set("query", query)
    }

    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-md shadow-md border p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-semibold flex items-center gap-1 text-gray-900 dark:text-gray-100">
          <Filter className="w-4 h-4" /> Filters
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-xs h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <RefreshCw className="w-3 h-3 mr-1" /> Reset
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["status", "type", "mode", "team", "cost"]} className="space-y-1">
        <AccordionItem value="status" className="border-b-0">
          <AccordionTrigger className="py-2 text-sm font-medium text-gray-800 dark:text-gray-200">
            Status
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2 pl-3">
            <RadioGroup className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="upcoming"
                  id="status-upcoming"
                  checked={filters.status === "upcoming"}
                  onClick={() =>
                    setFilters({ ...filters, status: filters.status === "upcoming" ? undefined : "upcoming" })
                  }
                />
                <Label htmlFor="status-upcoming" className="text-sm text-gray-700 dark:text-gray-300">
                  Upcoming
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="live"
                  id="status-live"
                  checked={filters.status === "live"}
                  onClick={() => setFilters({ ...filters, status: filters.status === "live" ? undefined : "live" })}
                />
                <Label htmlFor="status-live" className="text-sm text-gray-700 dark:text-gray-300">
                  Live
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="ended"
                  id="status-ended"
                  checked={filters.status === "ended"}
                  onClick={() => setFilters({ ...filters, status: filters.status === "ended" ? undefined : "ended" })}
                />
                <Label htmlFor="status-ended" className="text-sm text-gray-700 dark:text-gray-300">
                  Ended
                </Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type" className="border-b-0">
          <AccordionTrigger className="py-2 text-sm font-medium text-gray-800 dark:text-gray-200">
            Event Type
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2 pl-3">
            <RadioGroup className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Hackathon"
                  id="type-hackathon"
                  checked={filters.type === "Hackathon"}
                  onClick={() =>
                    setFilters({ ...filters, type: filters.type === "Hackathon" ? undefined : "Hackathon" })
                  }
                />
                <Label htmlFor="type-hackathon" className="text-sm text-gray-700 dark:text-gray-300">
                  Hackathon
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Competition"
                  id="type-competition"
                  checked={filters.type === "Competition"}
                  onClick={() =>
                    setFilters({ ...filters, type: filters.type === "Competition" ? undefined : "Competition" })
                  }
                />
                <Label htmlFor="type-competition" className="text-sm text-gray-700 dark:text-gray-300">
                  Competition
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Hiring Challenge"
                  id="type-hiring"
                  checked={filters.type === "Hiring Challenge"}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      type: filters.type === "Hiring Challenge" ? undefined : "Hiring Challenge",
                    })
                  }
                />
                <Label htmlFor="type-hiring" className="text-sm text-gray-700 dark:text-gray-300">
                  Hiring
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Symposium"
                  id="type-symposium"
                  checked={filters.type === "Symposium"}
                  onClick={() =>
                    setFilters({ ...filters, type: filters.type === "Symposium" ? undefined : "Symposium" })
                  }
                />
                <Label htmlFor="type-symposium" className="text-sm text-gray-700 dark:text-gray-300">
                  Symposium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Workshop"
                  id="type-workshop"
                  checked={filters.type === "Workshop"}
                  onClick={() => setFilters({ ...filters, type: filters.type === "Workshop" ? undefined : "Workshop" })}
                />
                <Label htmlFor="type-workshop" className="text-sm text-gray-700 dark:text-gray-300">
                  Workshop
                </Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mode" className="border-b-0">
          <AccordionTrigger className="py-2 text-sm font-medium text-gray-800 dark:text-gray-200">
            Mode
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2 pl-3">
            <RadioGroup className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Online"
                  id="mode-online"
                  checked={filters.mode === "Online"}
                  onClick={() => setFilters({ ...filters, mode: filters.mode === "Online" ? undefined : "Online" })}
                />
                <Label htmlFor="mode-online" className="text-sm text-gray-700 dark:text-gray-300">
                  Online
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Offline"
                  id="mode-offline"
                  checked={filters.mode === "Offline"}
                  onClick={() => setFilters({ ...filters, mode: filters.mode === "Offline" ? undefined : "Offline" })}
                />
                <Label htmlFor="mode-offline" className="text-sm text-gray-700 dark:text-gray-300">
                  Offline
                </Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="team" className="border-b-0">
          <AccordionTrigger className="py-2 text-sm font-medium text-gray-800 dark:text-gray-200">
            Team Event
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2 pl-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-team-event"
                checked={filters.is_team_event === true}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, is_team_event: checked === true ? true : undefined })
                }
              />
              <Label htmlFor="is-team-event" className="text-sm text-gray-700 dark:text-gray-300">
                Team Event
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cost" className="border-b-0">
          <AccordionTrigger className="py-2 text-sm font-medium text-gray-800 dark:text-gray-200">
            Registration
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2 pl-3">
            <RadioGroup className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="free"
                  id="cost-free"
                  checked={filters.registration_cost === false}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      registration_cost: filters.registration_cost === false ? undefined : false,
                    })
                  }
                />
                <Label htmlFor="cost-free" className="text-sm text-gray-700 dark:text-gray-300">
                  Free
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="paid"
                  id="cost-paid"
                  checked={filters.registration_cost === true}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      registration_cost: filters.registration_cost === true ? undefined : true,
                    })
                  }
                />
                <Label htmlFor="cost-paid" className="text-sm text-gray-700 dark:text-gray-300">
                  Paid
                </Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full mt-4 h-10 text-sm bg-green-600 hover:bg-green-700 font-medium" onClick={applyFilters}>
        Apply Filters
      </Button>
    </div>
  )
}
