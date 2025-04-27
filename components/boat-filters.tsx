"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import type { Boat } from "@/types/boat"

interface BoatFiltersProps {
  boats: Boat[]
}

export function BoatFilters({ boats }: BoatFiltersProps) {
  // Extract unique boat types
  const boatTypes = Array.from(new Set(boats.map((boat) => boat.type)))

  // Find min and max prices
  const prices = boats.flatMap((boat) => [
    boat.pricing.weekday["4h"],
    boat.pricing.weekday["6h"],
    boat.pricing.weekday["8h"],
    boat.pricing.weekend["4h"],
    boat.pricing.weekend["6h"],
    boat.pricing.weekend["8h"],
  ])
  const minPrice = Math.min(...(prices.length ? prices : [0]))
  const maxPrice = Math.max(...(prices.length ? prices : [1000]))

  // Find max capacity
  const capacities = boats.map((boat) => boat.capacity)
  const maxCapacity = Math.max(...(capacities.length ? capacities : [12]))

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [minCapacity, setMinCapacity] = useState(0)

  // Update price range when min/max prices change
  useEffect(() => {
    setPriceRange([minPrice, maxPrice])
  }, [minPrice, maxPrice])

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, type])
    } else {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    }
  }

  const handleReset = () => {
    setPriceRange([minPrice, maxPrice])
    setSelectedTypes([])
    setMinCapacity(0)
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">Filtres</h2>

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 font-medium">Type de bateau</h3>
          <div className="space-y-2">
            {boatTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={(checked) => handleTypeChange(type, checked as boolean)}
                />
                <Label htmlFor={`type-${type}`}>{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-medium">Capacité minimale</h3>
          <div className="space-y-4">
            <Slider
              min={0}
              max={maxCapacity}
              step={1}
              value={[minCapacity]}
              onValueChange={(value) => setMinCapacity(value[0])}
            />
            <div className="flex justify-between text-sm">
              <span>0</span>
              <span>{minCapacity} personnes</span>
              <span>{maxCapacity}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-medium">Fourchette de prix</h3>
          <div className="space-y-4">
            <Slider min={minPrice} max={maxPrice} step={10} value={priceRange} onValueChange={setPriceRange} />
            <div className="flex justify-between text-sm">
              <span>{formatCurrency(priceRange[0])}</span>
              <span>{formatCurrency(priceRange[1])}</span>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleReset}>
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  )
}
