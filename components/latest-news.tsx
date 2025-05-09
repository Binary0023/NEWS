"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { ref, query, orderByChild, onValue, limitToLast } from "firebase/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface Article {
  id: string
  title: string
  content: string
  timestamp: number
}

export function LatestNews() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const articlesRef = ref(db, "stories")
    const articlesQuery = query(articlesRef, orderByChild("timestamp"), limitToLast(5))

    const unsubscribe = onValue(articlesQuery, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const articlesArray = Object.entries(data)
          .map(([id, article]: [string, any]) => ({
            id,
            title: article.title,
            content: article.content,
            timestamp: article.timestamp,
          }))
          .sort((a, b) => b.timestamp - a.timestamp)

        setArticles(articlesArray)
      } else {
        setArticles([])
      }
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-secondary/50 to-secondary/30 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-secondary-foreground" />
            Latest Updates
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

  if (articles.length === 0) {
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-secondary/50 to-secondary/30 border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-secondary-foreground" />
          Latest Updates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {articles.map((article) => (
            <li key={article.id} className="flex items-start gap-3">
              <div>
                <Link href={`/article/${article.id}`}>
                  <h3 className="font-medium hover:text-secondary transition-colors">{article.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {new Date(article.timestamp).toLocaleTimeString()} •{" "}
                  {new Date(article.timestamp).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
