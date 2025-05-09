"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Sun, Moon, Flame, LogOut, User, LogIn, Search, ChevronDown } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themes = [
  { name: "Light", value: "light" },
  { name: "Dark", value: "dark" },
  { name: "System", value: "system" },
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Red", value: "red" },
  { name: "Purple", value: "purple" },
  { name: "Orange", value: "orange" },
  { name: "Pink", value: "pink" },
  { name: "Teal", value: "teal" },
]

export function NewsHeader() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Check auth state on component mount
  useEffect(() => {
    setMounted(true)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-primary text-white">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-8 h-8" />
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold">📰 News Hub</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-8 h-8" />
            <div className="w-8 h-8" />
            <div className="w-8 h-8" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-primary text-white">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <SidebarTrigger className="text-white hover:bg-white/20 hover:text-white" />
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">📰 News Hub</span>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/search">
            <Button
              variant="ghost"
              size="icon"
              title="Search"
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/trending">
            <Button
              variant="ghost"
              size="icon"
              title="Trending News"
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <Flame className="h-5 w-5" />
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 hover:text-white">
                {theme === "dark" ? <Moon className="h-5 w-5 mr-1" /> : <Sun className="h-5 w-5 mr-1" />}
                <span className="hidden md:inline">Theme</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {themes.map((t) => (
                <DropdownMenuItem
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={theme === t.value ? "bg-accent" : ""}
                >
                  {t.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isLoggedIn ? (
            <>
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 hover:text-white"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="destructive" size="sm" onClick={handleLogout} title="Logout" className="hidden md:flex">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button variant="destructive" size="icon" onClick={handleLogout} title="Logout" className="md:hidden">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="secondary" size="sm" className="hidden md:flex">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 hover:text-white md:hidden"
                title="Login"
              >
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
