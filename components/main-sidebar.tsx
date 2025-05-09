"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Home, Film, Bookmark, Settings, User, LogIn, Tag, Search, Newspaper } from "lucide-react"
import { db } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import { auth } from "@/lib/firebase"

export function MainSidebar() {
  const pathname = usePathname()
  const [topics, setTopics] = useState<{ id: string; name: string }[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const topicsRef = ref(db, "topics")
    const unsubscribe = onValue(topicsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const topicsArray = Object.entries(data).map(([id, topic]: [string, any]) => ({
          id,
          name: topic.name,
        }))
        setTopics(topicsArray)
      }
    })

    return () => {
      // Detach the listener
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user)
      setIsAdmin(user?.email === "syedzamanabbas86@gmail.com")
    })
    return () => unsubscribe()
  }, [])

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-2">
          <Link href="/">
            <div className="flex items-center gap-2 px-2">
              <Newspaper className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">News Hub</span>
            </div>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-background dark:bg-background">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/"}>
              <Link href="/">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/search"}>
              <Link href="/search">
                <Search className="h-5 w-5" />
                <span>Search</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/reels"}>
              <Link href="/reels">
                <Film className="h-5 w-5" />
                <span>Reels</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/bookmarks"}>
              <Link href="/bookmarks">
                <Bookmark className="h-5 w-5" />
                <span>Bookmarks</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarGroup>
          <SidebarGroupLabel>Topics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {topics.map((topic) => (
                <SidebarMenuItem key={topic.id}>
                  <SidebarMenuButton asChild isActive={pathname === `/topic/${topic.name.toLowerCase()}`}>
                    <Link href={`/topic/${topic.name.toLowerCase()}`}>
                      <Tag className="h-4 w-4" />
                      <span className="capitalize">{topic.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-background dark:bg-background">
        <SidebarMenu>
          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/admin")}>
                <Link href="/admin/dashboard">
                  <Settings className="h-5 w-5" />
                  <span>Admin Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {isLoggedIn ? (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/profile">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/login">
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
