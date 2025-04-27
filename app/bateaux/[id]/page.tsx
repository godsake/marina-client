"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getBoats, fallbackBoats } from "@/data/boats"
import { BookingForm } from "@/components/booking-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Ship, Users } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Boat } from "@/types/boat"

export default function BoatPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [boat, setBoat] = useState<Boat | null>(null)
  const [loading, setLoading] = useState(true)
  const [isImageZoomed, setIsImageZoomed] = useState(false)

  useEffect(() => {
    async function fetchBoat() {
      try {
        const boats = await getBoats()
        const foundBoat = boats.find((b) => b.id === params.id)

        if (foundBoat) {
          setBoat(foundBoat)
        } else {
          // Try to find in fallback data if not found in API
          const fallbackBoat = fallbackBoats.find((b) => b.id === params.id)
          setBoat(fallbackBoat || null)
        }
      } catch (error) {
        console.error("Error fetching boat details:", error)
        // Try fallback data
        const fallbackBoat = fallbackBoats.find((b) => b.id === params.id)
        setBoat(fallbackBoat || null)
      } finally {
        setLoading(false)
      }
    }

    fetchBoat()
  }, [params.id])

  const toggleImageZoom = () => {
    setIsImageZoomed(!isImageZoomed)
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4">
        <div className="h-6 w-24 animate-pulse rounded bg-ocean-light mb-3"></div>
        <div className="h-48 w-full animate-pulse rounded-lg bg-ocean-light mb-3"></div>
        <div className="space-y-2 mb-4">
          <div className="h-6 w-1/2 animate-pulse rounded bg-ocean-light"></div>
          <div className="h-4 w-full animate-pulse rounded bg-ocean-light"></div>
          <div className="h-4 w-full animate-pulse rounded bg-ocean-light"></div>
        </div>
      </div>
    )
  }

  if (!boat) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4 text-center py-8">
        <Ship className="h-10 w-10 text-ocean-dark mx-auto mb-4 animate-float" />
        <h1 className="text-lg font-bold mb-2 text-ocean-dark">Bateau non trouvé</h1>
        <p className="text-gray-700 mb-4">Nous n'avons pas pu trouver le bateau que vous cherchez.</p>
        <Button onClick={() => router.push("/")} size="sm" className="bg-ocean-dark hover:bg-ocean-dark/90 text-white">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour à l'accueil
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          className="mb-3 h-8 pl-0 text-ocean-dark hover:text-ocean-DEFAULT hover:bg-transparent"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour
        </Button>

        <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden shadow-md">
          <Image src={boat.image_url || "/placeholder.svg"} alt={boat.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-3 text-white">
            <h1 className="text-xl font-bold">{boat.name}</h1>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-ocean-dark px-2 py-0.5 text-xs font-medium text-white">{boat.type}</span>
              <div className="flex items-center gap-1 text-xs text-white">
                <Users className="h-3 w-3" />
                <span>{boat.capacity} personnes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="bg-white rounded-lg shadow-sm p-3 mb-4 border border-ocean-light">
            <h2 className="text-base font-bold mb-2 text-ocean-dark">Description</h2>
            <div className="relative md:flex md:gap-4">
              {boat.secondary_image_url && (
                <div className="relative md:w-1/3 lg:w-1/4">
                  {/* Conteneur pour l'image avec clic uniquement */}
                  <div
                    className="float-right ml-3 mb-2 h-24 w-32 md:float-none md:ml-0 md:h-auto md:w-full cursor-pointer"
                    onClick={toggleImageZoom}
                  >
                    <div className="relative h-24 w-32 md:h-48 md:w-full rounded-md overflow-hidden">
                      <Image
                        src={boat.secondary_image_url || "/placeholder.svg"}
                        alt={`${boat.name} - Vue secondaire`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Image zoomée (conditionnellement rendue) */}
                  {isImageZoomed && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                      onClick={() => setIsImageZoomed(false)}
                    >
                      <div className="relative max-h-[80vh] max-w-[80vw] rounded-lg overflow-hidden">
                        <Image
                          src={boat.secondary_image_url || "/placeholder.svg"}
                          alt={`${boat.name} - Vue secondaire`}
                          width={800}
                          height={600}
                          className="object-contain"
                        />
                        <button
                          className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsImageZoomed(false)
                          }}
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="md:flex-1">
                <p className="text-sm text-gray-700">{boat.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 border border-ocean-light">
            <h2 className="text-base font-bold mb-3 text-ocean-dark">Tarifs</h2>
            <div className="overflow-hidden rounded-md border border-ocean-light">
              <table className="w-full text-sm">
                <thead className="bg-ocean-dark text-white">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium">Durée</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Semaine</th>
                    <th className="px-3 py-2 text-left text-xs font-medium">Weekend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ocean-light">
                  <tr className="bg-white hover:bg-ocean-light/10">
                    <td className="px-3 py-2 text-xs font-medium text-gray-700">4h</td>
                    <td className="px-3 py-2 text-xs text-gray-700">{formatCurrency(boat.pricing.weekday["4h"])}</td>
                    <td className="px-3 py-2 text-xs text-gray-700">{formatCurrency(boat.pricing.weekend["4h"])}</td>
                  </tr>
                  <tr className="bg-white hover:bg-ocean-light/10">
                    <td className="px-3 py-2 text-xs font-medium text-gray-700">6h</td>
                    <td className="px-3 py-2 text-xs text-gray-700">{formatCurrency(boat.pricing.weekday["6h"])}</td>
                    <td className="px-3 py-2 text-xs text-gray-700">{formatCurrency(boat.pricing.weekend["6h"])}</td>
                  </tr>
                  <tr className="bg-white hover:bg-ocean-light/10">
                    <td className="px-3 py-2 text-xs font-medium text-gray-700">8h</td>
                    <td className="px-3 py-2 text-xs text-gray-700">{formatCurrency(boat.pricing.weekday["8h"])}</td>
                    <td className="px-3 py-2 text-xs text-gray-700">{formatCurrency(boat.pricing.weekend["8h"])}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-ocean-light bg-white p-4 shadow-sm">
          <h2 className="text-base font-bold mb-3 text-ocean-dark flex items-center">
            <Ship className="mr-2 h-5 w-5 text-ocean-dark" />
            Réserver {boat.name}
          </h2>
          <BookingForm boat={boat} />
        </div>
      </div>
    </div>
  )
}
