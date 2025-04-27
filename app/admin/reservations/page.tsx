import type { Metadata } from "next"
import { ReservationsList } from "@/components/admin/reservations/reservations-list"
import { ReservationsHeader } from "@/components/admin/reservations/reservations-header"

export const metadata: Metadata = {
  title: "Administration Marina | Gestion des Réservations",
  description: "Liste et gestion des réservations de la marina",
}

export default function ReservationsPage() {
  return (
    <div className="flex flex-col gap-5">
      <ReservationsHeader />
      <ReservationsList />
    </div>
  )
}
