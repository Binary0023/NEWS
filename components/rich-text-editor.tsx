"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  ImageIcon,
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [editorLoaded, setEditorLoaded] = useState(false)

  useEffect(() => {
    setEditorLoaded(true)
  }, [])

  const handleFormat = (format: string) => {
    const textarea = document.getElementById("rich-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    let formattedText = ""
    let cursorPosition = 0

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        cursorPosition = start + 2
        break
      case "italic":
        formattedText = `*${selectedText}*`
        cursorPosition = start + 1
        break
      case "underline":
        formattedText = `__${selectedText}__`
        cursorPosition = start + 2
        break
      case "ul":
        formattedText = `\n- ${selectedText}`
        cursorPosition = start + 3
        break
      case "ol":
        formattedText = `\n1. ${selectedText}`
        cursorPosition = start + 4
        break
      case "left":
        formattedText = `<div style="text-align: left">${selectedText}</div>`
        cursorPosition = start + 30
        break
      case "center":
        formattedText = `<div style="text-align: center">${selectedText}</div>`
        cursorPosition = start + 32
        break
      case "right":
        formattedText = `<div style="text-align: right">${selectedText}</div>`
        cursorPosition = start + 31
        break
      case "link":
        const url = prompt("Enter URL:", "https://")
        if (url) {
          formattedText = `[${selectedText || "Link text"}](${url})`
          cursorPosition = start + 1
        }
        break
      case "image":
        const imageUrl = prompt("Enter image URL:", "https://")
        if (imageUrl) {
          formattedText = `![${selectedText || "Image alt text"}](${imageUrl})`
          cursorPosition = start + 2
        }
        break
      default:
        return
    }

    if (formattedText) {
      const newValue = value.substring(0, start) + formattedText + value.substring(end)
      onChange(newValue)

      // Set cursor position after formatting
      setTimeout(() => {
        textarea.focus()
        if (selectedText) {
          textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
        } else {
          textarea.setSelectionRange(cursorPosition, cursorPosition + (selectedText.length || 0))
        }
      }, 0)
    }
  }

  if (!editorLoaded) {
    return <div className="h-64 border rounded-md bg-muted animate-pulse"></div>
  }

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-1 p-2 bg-muted border-b">
        <Button type="button" variant="ghost" size="icon" onClick={() => handleFormat("bold")} title="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => handleFormat("italic")} title="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => handleFormat("underline")} title="Underline">
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <Button type="button" variant="ghost" size="icon" onClick={() => handleFormat("ul")} title="Bullet List">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => handleFormat("ol")} title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <Button type="button" variant="ghost" size="icon" onClick={() => handleFormat("left")} title="Align Left">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => handleFormat("center")} title="Align Center">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => handleFormat("right")} title="Align Right">
          <AlignRight className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <Button type="button" variant="ghost" size="icon" onClick={() => handleFormat("link")} title="Insert Link">
          <Link className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => handleFormat("image")} title="Insert Image">
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        id="rich-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] border-0 focus-visible:ring-0 rounded-t-none"
        placeholder="Write your content here..."
      />
    </div>
  )
}
