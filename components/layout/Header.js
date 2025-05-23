"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Menu, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { UserProfile } from "@/components/ui/user-profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/app/providers"
import { Acme } from "next/font/google"
import { fetchWithAuth } from "@/app/api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import CreateHackathonDialog from "../host/create-hack"

const acme = Acme({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

// Debounce function to prevent rapid state changes
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function Header() {
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useAuth()
  const [scrollY, setScrollY] = React.useState(0)
  const debouncedScrollY = useDebounce(scrollY, 50) // 50ms debounce
  const isScrolled = debouncedScrollY > 10
  const [sheetOpen, setSheetOpen] = React.useState(false)

  React.useEffect(() => {
    async function getProfile() {
      try {
        const response = await fetchWithAuth(`/user/basic-profile/`)
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      }
    }

    console.log(profile)
    if (isAuthenticated && !profile?.first_name) {
      console.log("reached")
      getProfile()
    }
  }, [isAuthenticated])

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    setIsAuthenticated(false)
    setProfile(null)
    await fetchWithAuth(`/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  const closeSheet = () => {
    setSheetOpen(false)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-opacity duration-75",
        isScrolled
          ? "bg-white/95 top-3 shadow-md rounded-md backdrop-blur-sm py-3 border w-[calc(100%-20px)] mx-[10px] md:w-[calc(100%-60px)] md:mx-[30px]"
          : "bg-white top-0 py-3 w-full",
      )}
    >
      <div
        className={
          isScrolled
            ? "flex h-12 mx-auto px-4 sm:px-8 md:px-16 items-center justify-between"
            : "flex h-16 mx-auto px-4 sm:px-8 md:px-16 items-center justify-between"
        }
      >
        <div className="flex items-center gap-6">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <DialogTitle></DialogTitle>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden h-10 w-10 border-2 border-green-600/10 transition-all duration-200 hover:scale-110 rounded-md"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-6">
              <DialogDescription></DialogDescription>
              <div className="flex flex-col gap-8 py-2">
                <Link
                  href="/"
                  className="flex items-center"
                  onClick={closeSheet}
                  >
                  <span className={`${acme.className} text-2xl font-bold bg-gradient-to-r text-black bg-clip-text`}>
                    FIND<span className="text-green-600">H</span>ACKS
                  </span>
                </Link>

                {/* User Profile in Mobile Menu */}
                {isAuthenticated && profile && (
                  <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-md">
                    <Avatar className="h-12 w-12 border-2 border-green-600/10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.first_name} ${profile?.last_name}`}
                        alt={profile?.first_name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-lg">
                        {profile?.first_name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {profile.first_name} {profile.last_name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">{profile.email}</span>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col space-y-6">
                  <Link
                    href="/"
                    className="font-medium text-lg transition-colors duration-200 hover:text-green-600"
                    onClick={closeSheet}
                  >
                    Home
                  </Link>
                  <div className="space-y-3">
                    <h4 className="font-medium text-lg">Join a hackathon</h4>
                    <div className="pl-4 space-y-2 text-sm">
                      <Link
                        href="/hackathons?status=upcoming"
                        className="block py-1.5 transition-colors duration-200 hover:text-green-600"
                        onClick={closeSheet}
                      >
                        Upcoming
                      </Link>
                      <Link
                        href="/hackathons?status=live"
                        className="block py-1.5 transition-colors duration-200 hover:text-green-600"
                        onClick={closeSheet}
                      >
                        Ongoing
                      </Link>
                      <Link
                        href="/hackathons?status=ended"
                        className="block py-1.5 transition-colors duration-200 hover:text-green-600"
                        onClick={closeSheet}
                      >
                        Past
                      </Link>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-lg">Host a hackathon</h4>
                    <div className="pl-4 space-y-2 text-sm">
                      <Link
                        href="/host/create"
                        className="block py-1.5 transition-colors duration-200 hover:text-green-600"
                        onClick={closeSheet}
                      >
                        Create a hackathon
                      </Link>
                      <Link 
                        href="/host/create"
                        className="block py-1.5 transition-colors duration-200 hover:text-green-600"
                        onClick={closeSheet}
                      >
                        Organised hackathons
                      </Link>
                      <Link
                        href="/host/resources"
                        className="block py-1.5 transition-colors duration-200 hover:text-green-600"
                        onClick={closeSheet}
                      >
                        Organizer resources
                      </Link>
                      <Link
                        href="/host/pricing"
                        className="block py-1.5 transition-colors duration-200 hover:text-green-600"
                        onClick={closeSheet}
                      >
                        Pricing
                      </Link>
                    </div>
                  </div>
                </nav>

                {isAuthenticated && profile ? (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleLogout()
                      closeSheet()
                    }}
                    className="w-full rounded-md h-11 mt-auto flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3 mt-auto">
                    <Button variant="outline" asChild className="w-full rounded-md h-11">
                      <Link href="/login" onClick={closeSheet}>
                        Log in
                      </Link>
                    </Button>
                    <Button asChild className="w-full rounded-md h-11 bg-gradient-to-r from-green-500 to-green-600">
                      <Link href="/signup" onClick={closeSheet}>
                        Sign up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center lg:mr-8" >
            <span
              className={`${acme.className} text-2xl flex mx-6 lg:mx-0 font-bold bg-gradient-to-r text-black bg-clip-text transition-all duration-300`}
            >
              <Image src="/assets/logo.png" className="lg:-mt-2" width={150} height={25} alt="Logo" priority />
            </span>
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                  <NavigationMenuLink href="/"  className={cn(navigationMenuTriggerStyle(), "text-md rounded-md")}>
                    Home
                  </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="transition-all duration-200 text-md hover:bg-accent/80 rounded-md">
                  Join a hackathon
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-4 p-6 w-[400px] md:w-[500px] lg:w-[600px] grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-green-500 to-green-600 p-6 no-underline outline-none transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:shadow-md"
                          href="/hackathons"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium text-white">Featured Hackathons</div>
                          <p className="text-sm leading-tight text-white/90">
                            Discover the most popular hackathons happening right now
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/hackathons?status=upcoming" title="Upcoming">
                      Browse hackathons that are starting soon
                    </ListItem>
                    <ListItem href="/hackathons?status=live" title="Ongoing">
                      Join hackathons that are currently active
                    </ListItem>
                    <ListItem href="/hackathons?status=ended" title="Past">
                      View completed hackathons and winners
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="transition-all duration-200 hover:bg-accent/80 text-md rounded-md">
                  Host a hackathon
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid grid-cols-2 w-[800px] gap-4 p-6">
                    <ListItem showCreateDialog={true} title="Create a hackathon">
                      Set up and launch your own hackathon
                    </ListItem>
                    <ListItem href="/host" title="Organised hackathons">
                      List of hackathons which you have created
                    </ListItem>
                    <ListItem href="/host/resources" title="Organizer resources">
                      Guides and tools for hackathon organizers
                    </ListItem>
                    <ListItem href="/host/pricing" title="Pricing">
                      Plans and pricing for hosting hackathons
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && profile ? (
            <div className="flex items-center">
              <div className="">
                <UserProfile user={profile} onLogout={handleLogout} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-md px-5 transition-all duration-200 hover:scale-105">
                      Auth
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/login">Sign in</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup">Sign up</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="hidden lg:flex items-center gap-3">
                <Button
                  variant="outline"
                  asChild
                  className="rounded-md px-5 transition-all duration-200 hover:scale-105"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-md px-5 transition-all duration-200 hover:scale-105 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef(
  ({ className, title, children, href, showCreateDialog = false, parentEvents = [], ...props }, ref) => {
    const [dialogOpen, setDialogOpen] = React.useState(false)

    const handleClick = (e) => {
      if (showCreateDialog) {
        e.preventDefault()
        setDialogOpen(true)
      }
    }

    return (
      <li>

          <a
            ref={ref}
            href={href}
            onClick={handleClick}
            className={cn(
              "block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.01]",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-2">{children}</p>
          </a>

        {showCreateDialog && (
          <CreateHackathonDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        )}
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

