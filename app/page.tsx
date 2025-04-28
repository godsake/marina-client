import { BoatList } from "@/components/boat-list"
import { getBoats, fallbackBoats } from "@/data/boats"
import { Suspense } from "react"
import { BoatListSkeleton } from "@/components/boat-list-skeleton"
import { Ship, Waves } from "lucide-react"

export default async function Home() {
  // Use a try/catch to handle potential errors with data fetching
  let boatsData = fallbackBoats

  try {
    // Fetch boats data from the API
    const boats = await getBoats()
    // Use fallback data if the API returns empty
    if (boats && boats.length > 0) {
      boatsData = boats
    }
  } catch (error) {
    console.error("Error fetching boats:", error)
    // Fallback data is already assigned
  }

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden px-2 sm:px-4">
      <div className="p-4">
        <div className="mb-4 text-center">
          <div className="inline-flex items-center justify-center mb-2">
            <Ship className="h-5 w-5 text-ocean-dark mr-2" />
            <h1 className="text-xl font-bold text-ocean-dark">Location de Bateaux</h1>
          </div>
          <div className="mt-2 flex justify-center">
            <Waves className="h-5 w-5 text-ocean-dark animate-float" />
          </div>
        </div>

        <Suspense fallback={<BoatListSkeleton />}>
          <BoatList boats={boatsData} />
        </Suspense>
      </div>
    </div>
  )
}
