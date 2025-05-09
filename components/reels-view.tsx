"use client"

import { useState, useEffect, useRef } from "react"
import { db } from "@/lib/firebase"
import { ref, onValue, update } from "firebase/database"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Share2, ChevronUp, ChevronDown, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface Reel {
  id: string
  title: string
  videoUrl: string
  likes: number
  views: number
}

export function ReelsView() {
  const [reels, setReels] = useState<Reel[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const reelsRef = ref(db, "reels")

    const unsubscribe = onValue(reelsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const reelsArray = Object.entries(data).map(([id, reel]: [string, any]) => ({
          id,
          ...reel,
        }))

        setReels(reelsArray)
        videoRefs.current = videoRefs.current.slice(0, reelsArray.length)
      }
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    // Play the current video and pause others
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          video.play().catch((e) => console.error("Video play error:", e))

          // Update view count
          if (reels[index]) {
            const reelRef = ref(db, `reels/${reels[index].id}`)
            update(reelRef, {
              views: (reels[index].views || 0) + 1,
            })
          }
        } else {
          video.pause()
        }
      }
    })
  }, [currentIndex, reels])

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleLike = (reelId: string) => {
    const reelRef = ref(db, `reels/${reelId}`)
    const reel = reels.find((r) => r.id === reelId)

    if (reel) {
      update(reelRef, {
        likes: (reel.likes || 0) + 1,
      })

      toast({
        title: "Liked",
        description: "You liked this reel",
      })
    }
  }

  const handleShare = (reel: Reel) => {
    if (navigator.share) {
      navigator.share({
        title: reel.title,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Reel link copied to clipboard",
      })
    }
  }

  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (reels.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No reels found</h3>
        <p className="text-muted-foreground mt-2">There are no reels available at the moment.</p>
        <Button onClick={handleBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="relative h-[70vh] flex items-center justify-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="absolute top-0 left-0 z-30 m-4 bg-black/30 text-white hover:bg-black/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {reels.map((reel, index) => (
        <div
          key={reel.id}
          className={`absolute w-full max-w-md transition-all duration-500 ${
            index === currentIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <Card className="overflow-hidden border-none shadow-xl">
            <CardContent className="p-0 relative">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={reel.videoUrl}
                className="w-full h-[70vh] object-cover"
                loop
                playsInline
                controls={false}
                onClick={() => {
                  const video = videoRefs.current[index]
                  if (video) {
                    video.paused ? video.play() : video.pause()
                  }
                }}
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white text-lg font-bold mb-2">{reel.title}</h3>
                <div className="flex justify-between items-center">
                  <div className="text-white text-sm">{reel.views || 0} views</div>
                  <div className="flex space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={() => handleLike(reel.id)}
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={() => handleShare(reel)}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20">
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 hover:text-white"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
      >
        <ChevronUp className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 hover:text-white"
        onClick={handleNext}
        disabled={currentIndex === reels.length - 1}
      >
        <ChevronDown className="h-6 w-6" />
      </Button>
    </div>
  )
}
