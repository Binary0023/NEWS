"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Mic, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const recognitionRef = useRef<any>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in your browser.",
        variant: "destructive",
      })
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = "en-US"

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      toast({
        title: "Listening...",
        description: "Speak now to search.",
      })
    }

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setQuery(transcript)
      setIsListening(false)
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)
      setIsListening(false)
      toast({
        title: "Error",
        description: `Failed to recognize speech: ${event.error}`,
        variant: "destructive",
      })
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current.start()
  }

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const clearSearch = () => {
    setQuery("")
  }

  return (
    <form onSubmit={handleSearch} className="relative mb-6">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for news..."
            className="pl-10 pr-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
        >
          <Mic className={`h-5 w-5 ${isListening ? "text-red-500 animate-pulse" : ""}`} />
          <span className="sr-only">{isListening ? "Stop voice search" : "Start voice search"}</span>
        </Button>
        <Button type="submit" className="ml-2">
          Search
        </Button>
      </div>
    </form>
  )
}
