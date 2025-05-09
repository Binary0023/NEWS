"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Film, Bookmark, User, LogIn } from "lucide-react"
import { auth } from "@/lib/firebase"

export function MobileNavigation() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="mobile-nav">
      <div className="w-full grid grid-cols-4 gap-1">
        <Link href="/" className="flex flex-col items-center justify-center py-1">
          <div className={`p-1.5 rounded-full ${pathname === "/" ? "bg-primary/10" : ""}`}>
            <Home className={`h-5 w-5 ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <span className={`text-xs ${pathname === "/" ? "text-primary font-medium" : "text-muted-foreground"}`}>
            Home
          </span>
        </Link>

        <Link href="/reels" className="flex flex-col items-center justify-center py-1">
          <div className={`p-1.5 rounded-full ${pathname === "/reels" ? "bg-primary/10" : ""}`}>
            <Film className={`h-5 w-5 ${pathname === "/reels" ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <span className={`text-xs ${pathname === "/reels" ? "text-primary font-medium" : "text-muted-foreground"}`}>
            Reels
          </span>
        </Link>

        <Link href="/bookmarks" className="flex flex-col items-center justify-center py-1">
          <div className={`p-1.5 rounded-full ${pathname === "/bookmarks" ? "bg-primary/10" : ""}`}>
            <Bookmark className={`h-5 w-5 ${pathname === "/bookmarks" ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <span
            className={`text-xs ${pathname === "/bookmarks" ? "text-primary font-medium" : "text-muted-foreground"}`}
          >
            Bookmarks
          </span>
        </Link>

        {isLoggedIn ? (
          <Link href="/profile" className="flex flex-col items-center justify-center py-1">
            <div className={`p-1.5 rounded-full ${pathname === "/profile" ? "bg-primary/10" : ""}`}>
              <User className={`h-5 w-5 ${pathname === "/profile" ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <span
              className={`text-xs ${pathname === "/profile" ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              Profile
            </span>
          </Link>
        ) : (
          <Link href="/login" className="flex flex-col items-center justify-center py-1">
            <div className={`p-1.5 rounded-full ${pathname === "/login" ? "bg-primary/10" : ""}`}>
              <LogIn className={`h-5 w-5 ${pathname === "/login" ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <span className={`text-xs ${pathname === "/login" ? "text-primary font-medium" : "text-muted-foreground"}`}>
              Login
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}
