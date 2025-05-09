"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { ref, push, update, remove, onValue } from "firebase/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2 } from "lucide-react"
import dynamic from "next/dynamic"

// Import the rich text editor dynamically to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
  ssr: false,
  loading: () => <div className="h-64 border rounded-md bg-muted animate-pulse"></div>,
})

interface Article {
  id: string
  title: string
  content: string
  category: string
  timestamp: number
}

interface Topic {
  id: string
  name: string
}

export function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load articles
    const articlesRef = ref(db, "stories")
    const articlesUnsubscribe = onValue(articlesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const articlesArray = Object.entries(data)
          .map(([id, article]: [string, any]) => ({
            id,
            ...article,
          }))
          .sort((a, b) => b.timestamp - a.timestamp)

        setArticles(articlesArray)
      } else {
        setArticles([])
      }
    })

    // Load topics for the category dropdown
    const topicsRef = ref(db, "topics")
    const topicsUnsubscribe = onValue(topicsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const topicsArray = Object.entries(data).map(([id, topic]: [string, any]) => ({
          id,
          name: topic.name,
        }))

        setTopics(topicsArray)

        // Set default category if none is selected
        if (!category && topicsArray.length > 0) {
          setCategory(topicsArray[0].name)
        }
      }
    })

    return () => {
      articlesUnsubscribe()
      topicsUnsubscribe()
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const articleData = {
        title,
        content,
        category,
        timestamp: Date.now(),
        views: 0,
        likes: 0,
      }

      if (editingId) {
        // Update existing article
        await update(ref(db, `stories/${editingId}`), articleData)
        toast({
          title: "Success",
          description: "Article updated successfully",
        })
      } else {
        // Create new article
        await push(ref(db, "stories"), articleData)
        toast({
          title: "Success",
          description: "Article published successfully",
        })
      }

      // Reset form
      setTitle("")
      setContent("")
      setEditingId(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save article",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (article: Article) => {
    setTitle(article.title)
    setContent(article.content)
    setCategory(article.category)
    setEditingId(article.id)

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      await remove(ref(db, `stories/${id}`))
      toast({
        title: "Success",
        description: "Article deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setTitle("")
    setContent("")
    setEditingId(null)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Article" : "Create New Article"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.name}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>

            <div className="flex justify-end space-x-2">
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : editingId ? "Update Article" : "Publish Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Published Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles.length > 0 ? (
              articles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">{article.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Category: {article.category} •{new Date(article.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(article)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(article.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">No articles published yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
