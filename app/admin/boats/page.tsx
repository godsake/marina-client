import type { Metadata } from "next"
import { BoatsList } from "@/components/admin/boats/boats-list"
import { BoatsHeader } from "@/components/admin/boats/boats-header"

export const metadata: Metadata = {
  title: "Administration Marina | Gestion des Bateaux",
  description: "Liste et gestion des bateaux de la marina",
}

export default function BoatsPage() {
  return (
    <div className="flex flex-col gap-5">
      <BoatsHeader />
      <BoatsList />
    </div>
  )
}
