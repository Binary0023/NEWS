"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminArticles } from "@/components/admin/admin-articles"
import { AdminTopics } from "@/components/admin/admin-topics"
import { AdminBreakingNews } from "@/components/admin/admin-breaking-news"
import { AdminReels } from "@/components/admin/admin-reels"
import { AdminNewsForYou } from "@/components/admin/admin-news-for-you"
import { AdminTrending } from "@/components/admin/admin-trending"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== "syedzamanabbas86@gmail.com") {
        router.push("/admin")
      } else {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="articles">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="breaking">Breaking News</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="reels">Reels</TabsTrigger>
          <TabsTrigger value="for-you">News For You</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="mt-6">
          <AdminArticles />
        </TabsContent>

        <TabsContent value="topics" className="mt-6">
          <AdminTopics />
        </TabsContent>

        <TabsContent value="breaking" className="mt-6">
          <AdminBreakingNews />
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <AdminTrending />
        </TabsContent>

        <TabsContent value="reels" className="mt-6">
          <AdminReels />
        </TabsContent>

        <TabsContent value="for-you" className="mt-6">
          <AdminNewsForYou />
        </TabsContent>
      </Tabs>
    </div>
  )
}
