"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  // Default to false to avoid hydration mismatch
  const [matches, setMatches] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if window is defined (client-side only)
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query)

      // Set initial state
      setMatches(media.matches)

      // Define listener for changes
      const listener = () => setMatches(media.matches)

      // Add listener
      media.addEventListener("change", listener)

      // Clean up listener
      return () => media.removeEventListener("change", listener)
    }
  }, [query])

  // Return false during SSR to avoid hydration mismatch
  return mounted ? matches : false
}
