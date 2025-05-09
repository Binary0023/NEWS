"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { ref, query, orderByChild, onValue } from "firebase/database"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Heart, Clock, ArrowLeft, SearchIcon, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Article {
  id: string
  title: string
  content: string
  category: string
  timestamp: number
  views: number
  likes: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("newest")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const articlesRef = ref(db, "stories")
    const articlesQuery = query(articlesRef, orderByChild("timestamp"))

    const unsubscribe = onValue(articlesQuery, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const articlesArray = Object.entries(data).map(([id, article]: [string, any]) => ({
          id,
          ...article,
        }))

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(articlesArray.map((article) => article.category)))
        setCategories(uniqueCategories)

        setArticles(articlesArray)
        filterAndSortArticles(articlesArray, searchQuery, sortBy, categoryFilter)
      } else {
        setArticles([])
        setFilteredArticles([])
      }
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    filterAndSortArticles(articles, searchQuery, sortBy, categoryFilter)
  }, [searchQuery, sortBy, categoryFilter])

  const filterAndSortArticles = (articles: Article[], query: string, sort: string, category: string) => {
    let filtered = [...articles]

    // Apply category filter
    if (category !== "all") {
      filtered = filtered.filter((article) => article.category.toLowerCase() === category.toLowerCase())
    }

    // Apply search query filter
    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) || article.content.toLowerCase().includes(lowerQuery),
      )
    }

    // Apply sorting
    switch (sort) {
      case "newest":
        filtered.sort((a, b) => b.timestamp - a.timestamp)
        break
      case "oldest":
        filtered.sort((a, b) => a.timestamp - b.timestamp)
        break
      case "mostViewed":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case "mostLiked":
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0))
        break
    }

    setFilteredArticles(filtered)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterAndSortArticles(articles, searchQuery, sortBy, categoryFilter)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Search</h1>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for news..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Category
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={categoryFilter} onValueChange={setCategoryFilter}>
                <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
                {categories.map((category) => (
                  <DropdownMenuRadioItem key={category} value={category.toLowerCase()}>
                    {category}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Sort Results</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="mostViewed">Most Viewed</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="mostLiked">Most Liked</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button type="submit">Search</Button>
        </div>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </CardContent>
              <CardFooter>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? `No articles matching "${searchQuery}" were found.`
              : "No articles available. Try a different search or filter."}
          </p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div>
          <p className="mb-4 text-muted-foreground">
            Found {filteredArticles.length} {filteredArticles.length === 1 ? "result" : "results"}
            {searchQuery ? ` for "${searchQuery}"` : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <Link key={article.id} href={`/article/${article.id}`}>
                <Card className="card-hover border-none shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardHeader>
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                    <Badge variant="outline" className="w-fit capitalize bg-primary/10 text-primary border-primary/20">
                      {article.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-muted-foreground">{article.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Eye className="mr-1 h-4 w-4" />
                        {article.views || 0}
                      </span>
                      <span className="flex items-center">
                        <Heart className="mr-1 h-4 w-4" />
                        {article.likes || 0}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {new Date(article.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <Button>Read Article</Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
