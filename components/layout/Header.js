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
import { Input } from "@/components/ui/input"
import { Search, Menu, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { useRouter } from "next/navigation"
import { api } from "@/app/api"
import { UserProfile } from "@/components/ui/user-profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/app/providers"

export function Header() {
  const { isAuthenticated,setIsAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = React.useState(false)
  const router = useRouter()
  const [profile, setProfile] = React.useState(null)

  React.useEffect(() => {
    async function getProfile(jwtCookie) {
      try {
        const response = await fetch(`${api}user/basic-profile/`,{
          headers: {
            Authorization: `Bearer ${jwtCookie.split("=")[1]}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setProfile(data);
          console.log(data)
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      }
    }

    // if (typeof document !== "undefined") {
      const cookies = document?.cookie ? document?.cookie?.split("; ") : []
      const jwtCookie = cookies.find((row) => row.startsWith("jwt="))

      if (jwtCookie) {
        setIsAuthenticated(true)
        getProfile(jwtCookie)
      }
    // }
  }, [])

  React.useEffect(() => {
    async function getProfile(jwtCookie) {
      try {
        const response = await fetch(`${api}user/basic-profile/`,{
          headers: {
            Authorization: `Bearer ${jwtCookie.split("=")[1]}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setProfile(data);
          console.log(data)
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      }
    }

    if (isAuthenticated) {
      console.log("reached")
      const cookies = document?.cookie ? document?.cookie?.split("; ") : []
      const jwtCookie = cookies.find((row) => row.startsWith("jwt="))
      getProfile(jwtCookie)
    }
  }, [isAuthenticated])

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    setIsAuthenticated(false)
    setProfile(null)
    // window.location.reload();
    router.push("/login");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-sm border-b shadow-sm py-2" : "bg-white border-b py-3",
      )}
    >
      <div className="container flex h-16 mx-auto px-4 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center mr-8">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-transparent bg-clip-text transition-all duration-300 hover:scale-105">
              FINDHACKS
            </span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-md")}>Home</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="transition-all duration-200 text-md hover:bg-accent/80">
                  Join a hackathon
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-4 p-6 w-[400px] md:w-[500px] lg:w-[600px] grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-cyan-500 to-blue-600 p-6 no-underline outline-none transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:shadow-md"
                          href="/"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium text-white">Featured Hackathons</div>
                          <p className="text-sm leading-tight text-white/90">
                            Discover the most popular hackathons happening right now
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/hackathons/upcoming" title="Upcoming">
                      Browse hackathons that are starting soon
                    </ListItem>
                    <ListItem href="/hackathons/ongoing" title="Ongoing">
                      Join hackathons that are currently active
                    </ListItem>
                    <ListItem href="/hackathons/past" title="Past">
                      View completed hackathons and winners
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="transition-all duration-200 hover:bg-accent/80 text-md">
                  Host a hackathon
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-4 p-6">
                    <ListItem href="/host/create" title="Create a hackathon">
                      Set up and launch your own hackathon
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
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200" />
            <Input
              type="search"
              placeholder="Search hackathons..."
              className="w-[200px] lg:w-[300px] pl-10 pr-4 transition-all duration-300 focus:w-[250px] lg:focus:w-[350px] h-10 rounded-full"
            />
          </div>

          {isAuthenticated && profile ? (
            <div className="flex items-center">
              <div className="hidden md:block">
                <UserProfile user={profile} onLogout={handleLogout} />
              </div>

              <div className="md:hidden">
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0" onClick={handleLogout}>
                  <Avatar className="h-8 w-8 border-2 border-primary/10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.first_name} ${profile.last_name}`}
                      alt={profile.first_name}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs">
                      {profile.first_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="outline"
                asChild
                className="rounded-full px-5 transition-all duration-200 hover:scale-105"
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="rounded-full px-5 transition-all duration-200 hover:scale-105 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              >
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}

          <Sheet>
            <DialogTitle></DialogTitle>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden transition-all duration-200 hover:scale-110 rounded-full"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-6">
              <DialogDescription></DialogDescription>
              <div className="flex flex-col gap-8 py-6">
                <Link href="/" className="flex items-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-transparent bg-clip-text">
                    FINDHACKS
                  </span>
                </Link>

                {/* User Profile in Mobile Menu */}
                {isAuthenticated && profile && (
                  <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                    <Avatar className="h-12 w-12 border-2 border-primary/10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.first_name} ${profile.last_name}`}
                        alt={profile.first_name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-lg">
                        {profile.first_name.charAt(0).toUpperCase()}
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

                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search hackathons..." className="w-full pl-10 h-10 rounded-full" />
                </div>

                <nav className="flex flex-col space-y-6">
                  <Link href="/" className="font-medium text-lg transition-colors duration-200 hover:text-primary">
                    Home
                  </Link>
                  <div className="space-y-3">
                    <h4 className="font-medium text-lg">Join a hackathon</h4>
                    <div className="pl-4 space-y-2 text-sm">
                      <Link
                        href="/hackathons/upcoming"
                        className="block py-1.5 transition-colors duration-200 hover:text-primary"
                      >
                        Upcoming
                      </Link>
                      <Link
                        href="/hackathons/ongoing"
                        className="block py-1.5 transition-colors duration-200 hover:text-primary"
                      >
                        Ongoing
                      </Link>
                      <Link
                        href="/hackathons/past"
                        className="block py-1.5 transition-colors duration-200 hover:text-primary"
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
                        className="block py-1.5 transition-colors duration-200 hover:text-primary"
                      >
                        Create a hackathon
                      </Link>
                      <Link
                        href="/host/resources"
                        className="block py-1.5 transition-colors duration-200 hover:text-primary"
                      >
                        Organizer resources
                      </Link>
                      <Link
                        href="/host/pricing"
                        className="block py-1.5 transition-colors duration-200 hover:text-primary"
                      >
                        Pricing
                      </Link>
                    </div>
                  </div>
                </nav>

                {isAuthenticated && profile ? (
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-full rounded-full h-11 mt-auto flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3 mt-auto">
                    <Button variant="outline" asChild className="w-full rounded-full h-11">
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button asChild className="w-full rounded-full h-11 bg-gradient-to-r from-cyan-600 to-blue-600">
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.01]",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-2">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
