"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function BreakingNews() {
  const [breakingNews, setBreakingNews] = useState<string | null>(null)

  useEffect(() => {
    const breakingNewsRef = ref(db, "breaking_news")
    const unsubscribe = onValue(breakingNewsRef, (snapshot) => {
      const data = snapshot.val()
      if (data && data.text) {
        setBreakingNews(data.text)
      } else {
        setBreakingNews(null)
      }
    })

    return () => {
      // Detach the listener
      unsubscribe()
    }
  }, [])

  if (!breakingNews) return null

  return (
    <Alert variant="destructive" className="overflow-hidden bg-gradient-secondary text-white border-none mb-4">
      <div className="flex items-center">
        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
        <div className="overflow-hidden w-full">
          <AlertDescription className="font-bold animate-marquee whitespace-nowrap">
            BREAKING: {breakingNews}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  )
}
