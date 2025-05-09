import { ArticleView } from "@/components/article-view"

export default function ArticlePage({ params }: { params: { id: string } }) {
  return <ArticleView articleId={params.id} />
}
