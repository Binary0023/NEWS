"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { ref, push, remove, onValue } from "firebase/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Trash2 } from "lucide-react"

interface TrendingItem {
  id: string
  title: string
  description: string
  timestamp: number
}

export function AdminTrending() {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

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
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const trendingData = {
        title,
        description,
        timestamp: Date.now(),
      }

      await push(ref(db, "trending"), trendingData)

      toast({
        title: "Success",
        description: "Trending news added successfully",
      })

      // Reset form
      setTitle("")
      setDescription("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add trending news",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trending news?")) return

    try {
      await remove(ref(db, `trending/${id}`))
      toast({
        title: "Success",
        description: "Trending news deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete trending news",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add Trending News</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter trending news title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter trending news description"
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Trending News"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trending News Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendingItems.length > 0 ? (
              trendingItems.map((item) => (
                <div key={item.id} className="flex items-start justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
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
              <p className="text-center py-4 text-muted-foreground">No trending news items added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 