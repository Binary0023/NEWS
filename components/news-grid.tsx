"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { ref, query, orderByChild, onValue, limitToLast } from "firebase/database"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Heart, Clock, Share2, Bookmark } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Article {
  id: string
  title: string
  content: string
  category: string
  timestamp: number
  views: number
  likes: number
}

export function NewsGrid({ topicFilter }: { topicFilter?: string }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    const articlesRef = ref(db, "stories")
    const articlesQuery = query(articlesRef, orderByChild("timestamp"), limitToLast(20))

    const unsubscribe = onValue(articlesQuery, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const articlesArray = Object.entries(data)
          .map(([id, article]: [string, any]) => ({
            id,
            ...article,
          }))
          .filter((article) => !topicFilter || article.category.toLowerCase() === topicFilter.toLowerCase())
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
  }, [topicFilter])

  const handleBookmark = (e: React.MouseEvent, article: Article) => {
    e.preventDefault()
    e.stopPropagation()

    // Get existing bookmarks from localStorage
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]")

    // Check if article is already bookmarked
    const isBookmarked = bookmarks.some((bookmark: Article) => bookmark.id === article.id)

    if (isBookmarked) {
      // Remove from bookmarks
      const updatedBookmarks = bookmarks.filter((bookmark: Article) => bookmark.id !== article.id)
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks))
      toast({
        title: "Bookmark removed",
        description: "Article removed from your bookmarks",
      })
    } else {
      // Add to bookmarks
      bookmarks.push(article)
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
      toast({
        title: "Bookmarked",
        description: "Article saved to your bookmarks",
      })
    }
  }

  const handleShare = (e: React.MouseEvent, article: Article) => {
    e.preventDefault()
    e.stopPropagation()

    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.content.substring(0, 100) + "...",
        url: `/article/${article.id}`,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      const url = `${window.location.origin}/article/${article.id}`
      navigator.clipboard.writeText(url)
      toast({
        title: "Link copied",
        description: "Article link copied to clipboard",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </CardContent>
            <CardFooter>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No articles found</h3>
        <p className="text-muted-foreground mt-2">
          {topicFilter
            ? `There are no articles in the ${topicFilter} category yet.`
            : "There are no articles available at the moment."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map((article) => (
        <Card
          key={article.id}
          className="card-hover border-none shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
        >
          <CardHeader>
            <CardTitle className="text-xl">{article.title}</CardTitle>
            <Badge variant="outline" className="w-fit capitalize bg-primary/10 text-primary border-primary/20">
              {article.category}
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3 text-muted-foreground">{article.content}</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex justify-between w-full">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Eye className="mr-1 h-4 w-4" />
                  {article.views || 0}
                </span>
                <span className="flex items-center">
                  <Heart className="mr-1 h-4 w-4" />
                  {article.likes || 0}
                </span>
                <span className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {new Date(article.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={(e) => handleBookmark(e, article)}>
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={(e) => handleShare(e, article)}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Link href={`/article/${article.id}`} className="w-full">
              <Button className="w-full">Read Article</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
