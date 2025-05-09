"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { ref, set, onValue } from "firebase/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle } from "lucide-react"

export function AdminBreakingNews() {
  const [breakingNews, setBreakingNews] = useState("")
  const [currentBreakingNews, setCurrentBreakingNews] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const breakingNewsRef = ref(db, "breaking_news")
    const unsubscribe = onValue(breakingNewsRef, (snapshot) => {
      const data = snapshot.val()
      if (data && data.text) {
        setCurrentBreakingNews(data.text)
      } else {
        setCurrentBreakingNews(null)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!breakingNews.trim()) {
      toast({
        title: "Error",
        description: "Please enter breaking news text",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await set(ref(db, "breaking_news"), {
        text: breakingNews,
        timestamp: Date.now(),
      })

      toast({
        title: "Success",
        description: "Breaking news updated successfully",
      })

      // Reset form
      setBreakingNews("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update breaking news",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear the breaking news?")) return

    try {
      await set(ref(db, "breaking_news"), null)
      toast({
        title: "Success",
        description: "Breaking news cleared successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear breaking news",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Update Breaking News</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="breakingNews">Breaking News Text</Label>
              <Input
                id="breakingNews"
                value={breakingNews}
                onChange={(e) => setBreakingNews(e.target.value)}
                placeholder="Enter breaking news text"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Breaking News"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Breaking News</CardTitle>
        </CardHeader>
        <CardContent>
          {currentBreakingNews ? (
            <div className="space-y-4">
              <div className="flex items-center p-4 border rounded-md bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="font-medium">BREAKING: {currentBreakingNews}</p>
              </div>

              <div className="flex justify-end">
                <Button variant="destructive" onClick={handleClear}>
                  Clear Breaking News
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No breaking news currently set.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
