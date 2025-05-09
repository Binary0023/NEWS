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
import { Trash2, Upload } from "lucide-react"

interface Reel {
  id: string
  title: string
  videoUrl: string
  timestamp: number
}

export function AdminReels() {
  const [reels, setReels] = useState<Reel[]>([])
  const [title, setTitle] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const reelsRef = ref(db, "reels")
    const unsubscribe = onValue(reelsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const reelsArray = Object.entries(data)
          .map(([id, reel]: [string, any]) => ({
            id,
            ...reel,
          }))
          .sort((a, b) => b.timestamp - a.timestamp)

        setReels(reelsArray)
      } else {
        setReels([])
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !videoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const reelData = {
        title,
        videoUrl,
        timestamp: Date.now(),
        views: 0,
        likes: 0,
      }

      await push(ref(db, "reels"), reelData)

      toast({
        title: "Success",
        description: "Reel uploaded successfully",
      })

      // Reset form
      setTitle("")
      setVideoUrl("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload reel",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reel?")) return

    try {
      await remove(ref(db, `reels/${id}`))
      toast({
        title: "Success",
        description: "Reel deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reel",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Reel</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter reel title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Enter video URL"
                required
              />
              <p className="text-sm text-muted-foreground">Enter a direct link to an MP4 video file</p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  "Uploading..."
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Reel
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Reels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reels.length > 0 ? (
              reels.map((reel) => (
                <div key={reel.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">{reel.title}</h3>
                    <p className="text-sm text-muted-foreground truncate max-w-md">{reel.videoUrl}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(reel.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">No reels uploaded yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
