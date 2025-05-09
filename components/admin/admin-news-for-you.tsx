"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { ref, push, remove, onValue } from "firebase/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Trash2 } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  content: string
  timestamp: number
}

export function AdminNewsForYou() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const newsForYouRef = ref(db, "news_for_you")
    const unsubscribe = onValue(newsForYouRef, (snapshot) => {
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
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const newsItemData = {
        title,
        content,
        timestamp: Date.now(),
      }

      await push(ref(db, "news_for_you"), newsItemData)

      toast({
        title: "Success",
        description: "News item added successfully",
      })

      // Reset form
      setTitle("")
      setContent("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add news item",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news item?")) return

    try {
      await remove(ref(db, `news_for_you/${id}`))
      toast({
        title: "Success",
        description: "News item deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete news item",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add News For You Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter news title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter news content"
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add News Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>News For You Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newsItems.length > 0 ? (
              newsItems.map((item) => (
                <div key={item.id} className="flex items-start justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">No news items added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
