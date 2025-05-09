"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { ref, query, orderByChild, onValue, limitToLast } from "firebase/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface NewsItem {
  id: string
  title: string
  content: string
}

export function NewsForYou() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const newsForYouRef = ref(db, "news_for_you")
    const newsQuery = query(newsForYouRef, orderByChild("timestamp"), limitToLast(5))

    const unsubscribe = onValue(newsQuery, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const newsArray = Object.entries(data)
          .map(([id, item]: [string, any]) => ({
            id,
            ...item,
          }))
          .sort((a, b) => b.timestamp - a.timestamp)

        setNewsItems(newsArray)
      } else {
        setNewsItems([])
      }
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-accent/50 to-accent/30 border-none shadow-lg">
        <CardHeader>
          <CardTitle>News For You</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (newsItems.length === 0) {
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-accent/50 to-accent/30 border-none shadow-lg">
      <CardHeader>
        <CardTitle>News For You</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {newsItems.map((item) => (
          <Link key={item.id} href={`/news-for-you/${item.id}`}>
            <div className="hover:bg-white/50 dark:hover:bg-gray-800/50 p-3 rounded-md transition-colors">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
