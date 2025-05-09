import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Help Center</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Learn how to use News Hub effectively</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-primary hover:underline">
                  How to browse news
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary hover:underline">
                  Creating an account
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary hover:underline">
                  Using bookmarks
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary hover:underline">
                  Watching news reels
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
            <CardDescription>Manage your News Hub account</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-primary hover:underline">
                  Updating your profile
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary hover:underline">
                  Changing your password
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary hover:underline">
                  Privacy settings
                </Link>
              </li>
              <li>
                <Link href="#" className="text-primary hover:underline">
                  Deleting your account
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-1">How do I bookmark an article?</h3>
              <p className="text-muted-foreground">
                To bookmark an article, click the bookmark icon on any article card or within the article view. You can
                access your bookmarks from the sidebar or bottom navigation.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Can I listen to articles?</h3>
              <p className="text-muted-foreground">
                Yes, News Hub offers a text-to-speech feature. When viewing an article, click the "Listen" button to
                have the article read aloud to you.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-1">How do I search for specific news?</h3>
              <p className="text-muted-foreground">
                Use the search bar at the top of the home page or navigate to the Search page from the sidebar. You can
                search by keywords and filter by category.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-1">What are News Reels?</h3>
              <p className="text-muted-foreground">
                News Reels are short video clips covering news stories. You can access them from the Reels section in
                the sidebar or bottom navigation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>Need more help? Contact our support team</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            If you couldn't find the answer to your question, please contact our support team. We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact">
              <Button className="w-full">Contact Us</Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" className="w-full">
                View All FAQs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
