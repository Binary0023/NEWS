import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { Newsletter } from "@/components/newsletter"

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">News Hub</h3>
            <p className="text-muted-foreground mb-4">
              Your trusted source for the latest news and updates from around the world.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-muted-foreground hover:text-primary">
                  Trending
                </Link>
              </li>
              <li>
                <Link href="/reels" className="text-muted-foreground hover:text-primary">
                  Reels
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" className="text-muted-foreground hover:text-primary">
                  Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-muted-foreground hover:text-primary">
                  Report an Issue
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/copyright" className="text-muted-foreground hover:text-primary">
                  Copyright
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-muted-foreground hover:text-primary">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <Newsletter />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} News Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
