"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import "../app/themes.css"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      themes={["light", "dark", "system", "blue", "green", "red", "purple", "orange", "pink", "teal"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
