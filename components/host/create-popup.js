"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import CreateHackathonDialog from "./create-hack"

export default function CreateHackathonButton() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        className="text-base sm:text-lg md:text-xl px-4 py-8 sm:px-5 sm:py-6 md:px-6 md:py-6 whitespace-normal break-words text-center"
      >
        Ready to host? Make it happen on FindHacks!
      </Button>

      <CreateHackathonDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
