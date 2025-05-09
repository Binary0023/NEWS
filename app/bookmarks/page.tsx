"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Heart, Clock, Bookmark, ArrowLeft, Trash2 } from "lucide-react"
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

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get bookmarks from localStorage
    const storedBookmarks = localStorage.getItem("bookmarks")
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks))
    }
    setLoading(false)
  }, [])

  const handleRemoveBookmark = (article: Article) => {
    // Remove from bookmarks
    const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== article.id)
    setBookmarks(updatedBookmarks)
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks))

    toast({
      title: "Bookmark removed",
      description: "Article removed from your bookmarks",
    })
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all bookmarks?")) {
      setBookmarks([])
      localStorage.setItem("bookmarks", JSON.stringify([]))

      toast({
        title: "Bookmarks cleared",
        description: "All bookmarks have been removed",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Bookmarks</h1>
        </div>

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
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Bookmarks</h1>
        </div>

        {bookmarks.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">No bookmarks yet</h3>
          <p className="text-muted-foreground mb-4">Articles you bookmark will appear here for easy access.</p>
          <Link href="/">
            <Button>Browse Articles</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookmarks.map((article) => (
            <Card key={article.id} className="card-hover">
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <Badge variant="outline" className="w-fit capitalize">
                  {article.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">{article.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
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
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveBookmark(article)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Link href={`/article/${article.id}`}>
                    <Button>Read</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
