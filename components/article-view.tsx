"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { ref, onValue, update, push } from "firebase/database"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageSquare, Share2, Bookmark, Download, Volume2, VolumeX, Sparkles, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { auth } from "@/lib/firebase"

interface Article {
  id: string
  title: string
  content: string
  category: string
  timestamp: number
  views: number
  likes: number
}

interface Comment {
  id: string
  text: string
  timestamp: number
  username: string
}

export function ArticleView({ articleId }: { articleId: string }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [summarizing, setSummarizing] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const { toast } = useToast()
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const router = useRouter()

  useEffect(() => {
    const articleRef = ref(db, `stories/${articleId}`)

    const unsubscribe = onValue(articleRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setArticle({
          id: articleId,
          ...data,
        })

        // Update view count
        update(articleRef, {
          views: (data.views || 0) + 1,
        })
      }
      setLoading(false)
    })

    // Load comments
    const commentsRef = ref(db, `stories/${articleId}/comments`)
    const commentsUnsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const commentsArray = Object.entries(data)
          .map(([id, comment]: [string, any]) => ({
            id,
            ...comment,
          }))
          .sort((a, b) => b.timestamp - a.timestamp)

        setComments(commentsArray)
      } else {
        setComments([])
      }
    })

    return () => {
      unsubscribe()
      commentsUnsubscribe()

      // Stop speech if component unmounts
      if (speechSynthesis && speaking) {
        speechSynthesis.cancel()
      }
    }
  }, [articleId])

  const handleLike = () => {
    if (!article) return

    const articleRef = ref(db, `stories/${articleId}`)
    update(articleRef, {
      likes: (article.likes || 0) + 1,
    })

    toast({
      title: "Liked",
      description: "You liked this article",
    })
  }

  const handleBookmark = () => {
    if (!article) return

    // Get existing bookmarks from localStorage
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]")

    // Check if article is already bookmarked
    const isBookmarked = bookmarks.some((bookmark: Article) => bookmark.id === article.id)

    if (isBookmarked) {
      // Remove from bookmarks
      const updatedBookmarks = bookmarks.filter((bookmark: Article) => bookmark.id !== article.id)
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks))
      toast({
        title: "Bookmark removed",
        description: "Article removed from your bookmarks",
      })
    } else {
      // Add to bookmarks
      bookmarks.push(article)
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
      toast({
        title: "Bookmarked",
        description: "Article saved to your bookmarks",
      })
    }
  }

  const handleShare = () => {
    if (!article) return

    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.content.substring(0, 100) + "...",
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Article link copied to clipboard",
      })
    }
  }

  const handleDownloadPDF = () => {
    if (!article) return

    // This is a simplified version - in a real app, you'd use a library like jsPDF
    const element = document.createElement("a")
    const file = new Blob([`${article.title}\n\n${article.content}`], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${article.title.replace(/\s+/g, "-").toLowerCase()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Downloaded",
      description: "Article downloaded as text file",
    })
  }

  const handleTextToSpeech = () => {
    if (!article) return

    if (speaking) {
      // Stop speaking
      if (speechSynthesis) {
        speechSynthesis.cancel()
        setSpeaking(false)
      }
    } else {
      // Start speaking
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(article.content)
        speechSynthesisRef.current = utterance

        utterance.onend = () => {
          setSpeaking(false)
        }

        speechSynthesis.speak(utterance)
        setSpeaking(true)
      } else {
        toast({
          title: "Not supported",
          description: "Text-to-speech is not supported in your browser",
          variant: "destructive",
        })
      }
    }
  }

  const handleSummarize = async () => {
    if (!article) return

    setSummarizing(true)

    try {
      // This would be replaced with a real API call to Gemini
      // For now, we'll simulate a summary
      setTimeout(() => {
        const summaryText = `${article.title} is about ${article.content.split(" ").slice(0, 30).join(" ")}...`
        setSummary(summaryText)
        setSummarizing(false)
      }, 1500)

      // In a real implementation, you would use the Gemini API:
      /*
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: article.content }),
      });
      
      const data = await response.json();
      setSummary(data.summary);
      */
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary",
        variant: "destructive",
      })
    } finally {
      setSummarizing(false)
    }
  }

  const handleSubmitComment = () => {
    if (!article || !newComment.trim()) return

    const commentsRef = ref(db, `stories/${articleId}/comments`)
    push(commentsRef, {
      text: newComment,
      timestamp: Date.now(),
      username: auth.currentUser?.displayName || "Anonymous",
    })

    setNewComment("")

    toast({
      title: "Comment added",
      description: "Your comment has been posted",
    })
  }

  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Article not found</h2>
            <p className="text-muted-foreground">The article you're looking for doesn't exist or has been removed.</p>
            <Button onClick={handleBack} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="article-modal border-none shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="relative">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleBookmark} title="Bookmark">
                <Bookmark className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Bookmark</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleTextToSpeech} title="Listen">
                {speaking ? (
                  <>
                    <VolumeX className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Listen</span>
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF} title="Download">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} title="Share">
                <Share2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
          <CardTitle className="text-3xl">{article.title}</CardTitle>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className="capitalize bg-primary/10 text-primary border-primary/20">
              {article.category}
            </Badge>
            <span className="text-sm text-muted-foreground">{new Date(article.timestamp).toLocaleDateString()}</span>
          </div>
        </CardHeader>

        <CardContent className="prose dark:prose-invert max-w-none">
          {summary ? (
            <>
              <div className="bg-primary/10 p-4 rounded-md mb-6">
                <h3 className="flex items-center text-lg font-medium mb-2">
                  <Sparkles className="mr-2 h-5 w-5 text-primary" />
                  AI Summary
                </h3>
                <p>{summary}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSummary(null)} className="mb-6">
                Show Full Article
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" className="w-full mb-6" onClick={handleSummarize} disabled={summarizing}>
                <Sparkles className="mr-2 h-4 w-4" />
                {summarizing ? "Summarizing..." : "Summarize with AI"}
              </Button>
              <p className="whitespace-pre-line">{article.content}</p>
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-6">
          <div className="flex justify-between w-full">
            <Button variant="outline" size="sm" onClick={handleLike}>
              <Heart className="mr-2 h-4 w-4" />
              Like ({article.likes || 0})
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="w-full">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Comments ({comments.length})
            </h3>

            <div className="space-y-4 mb-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-muted p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{comment.username}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
