"use client"

import { useState, useEffect } from "react"
import { BoatCard } from "@/components/boat-card"
import { Input } from "@/components/ui/input"
import type { Boat } from "@/types/boat"

interface BoatListProps {
  boats: Boat[]
}

export function BoatList({ boats }: BoatListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBoats, setFilteredBoats] = useState<Boat[]>([])
  const [mounted, setMounted] = useState(false)

  // Set mounted state on client side
  useEffect(() => {
    setMounted(true)
    setFilteredBoats(boats)
  }, [boats])

  // Update filtered boats when search term changes
  useEffect(() => {
    if (!mounted) return

    const filtered = boats.filter((boat) => {
      return (
        boat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boat.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boat.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
    setFilteredBoats(filtered)
  }, [searchTerm, boats, mounted])

  // Avoid hydration mismatch by rendering a simpler version on server
  if (!mounted) {
    return (
      <div>
        <div className="mb-3">
          <Input type="search" placeholder="Rechercher un bateau..." className="h-9 text-sm" disabled />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {boats.map((boat) => (
            <BoatCard key={boat.id} boat={boat} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-3">
        <Input
          type="search"
          placeholder="Rechercher un bateau..."
          className="h-9 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBoats.map((boat) => (
          <BoatCard key={boat.id} boat={boat} />
        ))}
      </div>

      {filteredBoats.length === 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Aucun bateau ne correspond à votre recherche.</p>
        </div>
      )}
    </div>
  )
}
