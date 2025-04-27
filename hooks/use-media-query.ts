"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  // Par défaut, supposons que nous sommes sur un appareil mobile
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Vérifier si window est défini (côté client uniquement)
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query)

      // Définir l'état initial
      setMatches(media.matches)

      // Définir un écouteur pour les changements
      const listener = () => setMatches(media.matches)

      // Ajouter l'écouteur
      media.addEventListener("change", listener)

      // Nettoyer l'écouteur
      return () => media.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}
