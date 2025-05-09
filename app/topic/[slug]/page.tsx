import { NewsGrid } from "@/components/news-grid"

export default function TopicPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 capitalize">{params.slug}</h1>
      <NewsGrid topicFilter={params.slug} />
    </div>
  )
}
