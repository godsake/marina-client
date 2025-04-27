import type { Metadata } from "next"
import { BoatForm } from "@/components/admin/boats/boat-form"

export const metadata: Metadata = {
  title: "Administration Marina | Ajouter/Modifier un bateau",
  description: "Formulaire pour ajouter ou modifier un bateau",
}

export default function ManageBoatPage({ searchParams }: { searchParams: { id?: string } }) {
  const isEditing = !!searchParams.id

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold tracking-tight">{isEditing ? "Modifier un bateau" : "Ajouter un bateau"}</h1>
      <BoatForm boatId={searchParams.id} />
    </div>
  )
}
