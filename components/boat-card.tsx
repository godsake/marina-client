import Link from "next/link"
import Image from "next/image"
import { Anchor, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import type { Boat } from "@/types/boat"

interface BoatCardProps {
  boat: Boat
}

export function BoatCard({ boat }: BoatCardProps) {
  // Get the lowest price for display
  const lowestPrice = boat.pricing.weekday["4h"]

  return (
    <div className="group overflow-hidden rounded-lg border-2 border-ocean-light bg-white shadow-sm transition-all hover:shadow-md hover:shadow-ocean-light/20 hover:-translate-y-1">
      <div className="flex h-full flex-col">
        <Link href={`/bateaux/${boat.id}`} className="relative h-36 w-full overflow-hidden">
          <Image
            src={boat.image_url || "/placeholder.svg"}
            alt={boat.name}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute top-0 right-0 m-2 rounded-full bg-ocean-dark px-3 py-1 text-xs font-medium text-white">
            {boat.type}
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-3 bg-white">
          <h3 className="text-base font-bold text-ocean-dark">{boat.name}</h3>
          <p className="mb-3 line-clamp-2 text-xs text-gray-700">{boat.description}</p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs bg-ocean-light/20 px-2 py-1 rounded-full">
              <Users className="h-3 w-3 text-ocean-dark" />
              <span className="text-gray-700">{boat.capacity} personnes</span>
            </div>

            <div className="flex items-center gap-2">
              <div>
                <p className="text-right text-[10px] text-gray-600">À partir de</p>
                <p className="text-xs font-bold text-ocean-dark">{formatCurrency(lowestPrice)}</p>
              </div>

              <Link href={`/bateaux/${boat.id}`}>
                <Button size="sm" className="h-7 text-xs px-3 bg-ocean-dark hover:bg-ocean-dark/90 text-white">
                  <Anchor className="mr-1 h-3 w-3" />
                  Réserver
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
