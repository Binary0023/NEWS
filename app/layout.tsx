import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { NewsHeader } from "@/components/news-header"
import { MainSidebar } from "@/components/main-sidebar"
import { MobileNavigation } from "@/components/mobile-navigation"
import { Outfit, Oswald } from "next/font/google"
import { ScrollProgress } from "@/components/scroll-progress"
import { Footer } from "@/components/footer"
import "./globals.css"

// Initialize the fonts
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
})

const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
})

export const metadata = {
  title: "News Hub",
  description: "Your source for the latest news and updates",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${oswald.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/icons/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" sizes="180x180" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <div className="flex min-h-screen flex-col">
              <ScrollProgress />
              <NewsHeader />
              <div className="flex flex-1">
                <MainSidebar />
                <main className="flex-1 overflow-hidden pb-16 md:pb-0">
                  {children}
                  <Footer />
                </main>
              </div>
              <MobileNavigation />
            </div>
            <Toaster />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
