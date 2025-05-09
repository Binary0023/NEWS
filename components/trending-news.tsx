"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from "lucide-react"

interface TrendingItem {
  id: string
  title: string
  description: string
  timestamp: number
}

export function TrendingNews() {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const trendingRef = ref(db, "trending")
    const unsubscribe = onValue(trendingRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const trendingArray = Object.entries(data)
          .map(([id, item]: [string, any]) => ({
            id,
            ...item,
          }))
          .sort((a, b) => b.timestamp - a.timestamp)

        setTrendingItems(trendingArray)
      } else {
        setTrendingItems([])
      }
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-primary/50 to-primary/30 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flame className="mr-2 h-5 w-5 text-red-500" />
            Trending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (trendingItems.length === 0) {
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-primary/50 to-primary/30 border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Flame className="mr-2 h-5 w-5 text-red-500" />
          Trending
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {trendingItems.map((item, index) => (
            <li key={item.id} className="flex items-start gap-3">
              <span className="font-bold text-lg text-primary">{index + 1}</span>
              <div>
                <h3 className="font-medium hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
