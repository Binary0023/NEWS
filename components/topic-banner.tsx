"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function TopicBanner() {
  const [topics, setTopics] = useState<{ id: string; name: string }[]>([])

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
      }
    })

    return () => {
      // Detach the listener
      unsubscribe()
    }
  }, [])

  if (topics.length === 0) return null

  return (
    <div className="my-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 p-2">
          {topics.map((topic) => (
            <Link key={topic.id} href={`/topic/${topic.name.toLowerCase()}`}>
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm capitalize cursor-pointer hover:bg-primary hover:text-primary-foreground bg-gradient-to-r from-primary/10 to-primary/5"
              >
                {topic.name}
              </Badge>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
