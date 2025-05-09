import { BreakingNews } from "@/components/breaking-news"
import { TopicBanner } from "@/components/topic-banner"
import { NewsGrid } from "@/components/news-grid"
import { NewsForYou } from "@/components/news-for-you"
import { TrendingNews } from "@/components/trending-news"
import { LatestNews } from "@/components/latest-news"
import { SearchBar } from "@/components/search-bar"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <BreakingNews />
      <SearchBar />
      <TopicBanner />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TrendingNews />
          <h2 className="text-2xl font-bold mb-4 mt-8">Latest News</h2>
          <NewsGrid />
        </div>
        <div className="space-y-8">
          <LatestNews />
          <NewsForYou />
        </div>
      </div>
    </div>
  )
}
