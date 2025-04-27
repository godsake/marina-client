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
  const [filteredBoats, setFilteredBoats] = useState<Boat[]>(boats)

  // Update filtered boats when search term or boats prop changes
  useEffect(() => {
    const filtered = boats.filter((boat) => {
      return (
        boat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boat.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boat.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
    setFilteredBoats(filtered)
  }, [searchTerm, boats])

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
