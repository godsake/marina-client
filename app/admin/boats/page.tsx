import type { Metadata } from "next"
import { BoatsList } from "@/components/admin/boats/boats-list"
import { BoatsHeader } from "@/components/admin/boats/boats-header"
import { getBoats, fallbackBoats } from "@/data/boats"

export const metadata: Metadata = {
  title: "Administration Marina | Gestion des Bateaux",
  description: "Liste et gestion des bateaux de la marina",
}

// Marquer cette page comme dynamique pour éviter les erreurs de rendu statique
export const dynamic = "force-dynamic"

export default async function BoatsPage() {
  // Récupérer les données des bateaux depuis l'API
  const boats = await getBoats()

  // Utiliser les données de secours si l'API ne renvoie rien
  const boatsData = boats.length > 0 ? boats : fallbackBoats

  return (
    <div className="flex flex-col gap-5">
      <BoatsHeader />
      <BoatsList initialBoats={boatsData} />
    </div>
  )
}
