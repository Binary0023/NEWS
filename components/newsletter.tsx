"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }
    // Here you would typically send the email to your backend
    toast({
      title: "Success",
      description: "Thank you for subscribing to our newsletter!",
    })
    setEmail("")
  }

  return (
    <div className="bg-primary/5 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
      <p className="text-muted-foreground mb-4">
        Stay updated with the latest news and updates.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Subscribe</Button>
      </form>
    </div>
  )
} 