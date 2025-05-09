"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { ref, push, update, remove, onValue } from "firebase/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2 } from "lucide-react"

interface Topic {
  id: string
  name: string
}

export function AdminTopics() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [name, setName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const topicsRef = ref(db, "topics")
    const unsubscribe = onValue(topicsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const topicsArray = Object.entries(data).map(([id, topic]: [string, any]) => ({
          id,
          name: topic.name,
        }))

        setTopics(topicsArray)
      } else {
        setTopics([])
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic name",
        variant: "destructive",
      })
      return
    }

    // Check if topic already exists
    const exists = topics.some((topic) => topic.name.toLowerCase() === name.toLowerCase() && topic.id !== editingId)

    if (exists) {
      toast({
        title: "Error",
        description: "This topic already exists",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const topicData = {
        name,
      }

      if (editingId) {
        // Update existing topic
        await update(ref(db, `topics/${editingId}`), topicData)
        toast({
          title: "Success",
          description: "Topic updated successfully",
        })
      } else {
        // Create new topic
        await push(ref(db, "topics"), topicData)
        toast({
          title: "Success",
          description: "Topic created successfully",
        })
      }

      // Reset form
      setName("")
      setEditingId(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save topic",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (topic: Topic) => {
    setName(topic.name)
    setEditingId(topic.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this topic? This will not delete articles in this category.")) return

    try {
      await remove(ref(db, `topics/${id}`))
      toast({
        title: "Success",
        description: "Topic deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete topic",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setName("")
    setEditingId(null)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Topic" : "Create New Topic"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Topic Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter topic name"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : editingId ? "Update Topic" : "Create Topic"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topics.length > 0 ? (
              topics.map((topic) => (
                <div key={topic.id} className="flex items-center justify-between p-4 border rounded-md">
                  <h3 className="font-medium capitalize">{topic.name}</h3>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(topic)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(topic.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">No topics created yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
