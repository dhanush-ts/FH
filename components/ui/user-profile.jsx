// "use client"
// import { LogOut, User, Settings, Bell } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { useRouter } from "next/navigation"


// export function UserProfile({ user, onLogout }) {
//   const router = useRouter();
//   const getInitials = () => {
//     return user.first_name.charAt(0).toUpperCase()
//   }

//   return (
//   <div className="flex">
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           className="relative p-3 transition-all duration-200 hover:bg-accent/50 hover:scale-105"
//           >
//           <Avatar className="h-10 w-10 border-2 border-primary/10">
//             <AvatarImage
//               src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.first_name} ${user.last_name}`}
//               alt={user.first_name}
//             />
//             <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
//               {getInitials()}
//             </AvatarFallback>
//           </Avatar>
//           <span className="hidden sm:block">
//             {user?.first_name} {user?.last_name}
//         </span>
//         </Button>
//       </DropdownMenuTrigger>
         
//       <DropdownMenuContent align="end" className="w-64 p-2">
//         <div className="flex items-center gap-3 p-2">
//           <Avatar className="h-12 w-12 border-2 border-primary/10">
//             <AvatarImage
//               src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.first_name} ${user.last_name}`}
//               alt={user.first_name}
//             />
//             <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-lg">
//               {getInitials()}
//             </AvatarFallback>
//           </Avatar>
//           <div className="flex flex-col">
//             <div className="flex items-center gap-2">
//               <span className="font-medium">
//                 {user.first_name} {user.last_name}
//               </span>
//               {!user.is_verified && (
//                 <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200 px-1.5 py-0">
//                   Verify
//                 </Badge>
//               )}
//             </div>
//             <span className="text-xs text-muted-foreground truncate">{user.email}</span>
//           </div>
//         </div>

//         <DropdownMenuSeparator />

//         <DropdownMenuItem onClick={() => router.push("/profile")} className="flex items-center gap-2 cursor-pointer py-2">
//           <User className="h-4 w-4 text-slate-500" />
//           <span>My Profile</span>
//         </DropdownMenuItem>

//         <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2">
//           <Bell className="h-4 w-4 text-slate-500" />
//           <span>Notifications</span>
//         </DropdownMenuItem>

//         <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2">
//           <Settings className="h-4 w-4 text-slate-500" />
//           <span>Settings</span>
//         </DropdownMenuItem>

//         <DropdownMenuSeparator />

//         <DropdownMenuItem
//           className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 py-2"
//           onClick={onLogout}
//         >
//           <LogOut className="h-4 w-4" />
//           <span>Logout</span>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   </div>
//   )
// }

import { LogOut, User, Settings, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export function UserProfile({ user, onLogout }) {
  const router = useRouter();
  const getInitials = () => {
    return user.first_name.charAt(0).toUpperCase()
  }

  return (
  <div className="flex">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative p-3 transition-all duration-200 hover:bg-accent/50 hover:scale-105"
          >
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.first_name} ${user.last_name}`}
              alt={user.first_name}
            />
            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:block max-w-[10rem] truncate">
            {user?.first_name} {user?.last_name}
        </span>
        </Button>
      </DropdownMenuTrigger>
         
      <DropdownMenuContent align="end" className="min-w-[16rem] p-2">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-12 w-12 border-2 border-primary/10">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.first_name} ${user.last_name}`}
              alt={user.first_name}
            />
            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-lg">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium max-w-xs truncate">
                {user.first_name} {user.last_name}
              </span>
              {!user.is_verified && (
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200 px-1.5 py-0">
                  Verify
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground max-w-[12rem] truncate">
              {user.email}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push("/profile")} className="flex items-center gap-2 cursor-pointer py-2">
          <User className="h-4 w-4 text-slate-500" />
          <span>My Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2">
          <Bell className="h-4 w-4 text-slate-500" />
          <span>Notifications</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2">
          <Settings className="h-4 w-4 text-slate-500" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 py-2"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  )
}
