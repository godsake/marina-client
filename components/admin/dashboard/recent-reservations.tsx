"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, FileText } from "lucide-react"

interface RecentReservationsProps {
  showAll?: boolean
}

export function RecentReservations({ showAll = false }: RecentReservationsProps) {
  const [reservations] = useState([
    {
      id: "RES-001",
      client: "Jean Dupont",
      boat: "Voilier Étoile de Mer",
      date: "2025-05-01",
      time: "09:00 - 13:00",
      status: "Confirmée",
      amount: 250,
    },
    {
      id: "RES-002",
      client: "Marie Martin",
      boat: "Yacht Océan",
      date: "2025-05-01",
      time: "10:00 - 16:00",
      status: "En cours",
      amount: 450,
    },
    {
      id: "RES-003",
      client: "Pierre Durand",
      boat: "Catamaran Horizon",
      date: "2025-05-02",
      time: "09:00 - 17:00",
      status: "En attente",
      amount: 600,
    },
    {
      id: "RES-004",
      client: "Sophie Leroy",
      boat: "Bateau à moteur Rapide",
      date: "2025-05-02",
      time: "14:00 - 18:00",
      status: "Confirmée",
      amount: 320,
    },
    {
      id: "RES-005",
      client: "Lucas Bernard",
      boat: "Voilier Brise Marine",
      date: "2025-05-03",
      time: "09:00 - 13:00",
      status: "Annulée",
      amount: 250,
    },
    {
      id: "RES-006",
      client: "Emma Petit",
      boat: "Yacht Océan",
      date: "2025-05-03",
      time: "14:00 - 20:00",
      status: "Confirmée",
      amount: 480,
    },
    {
      id: "RES-007",
      client: "Thomas Roux",
      boat: "Catamaran Horizon",
      date: "2025-05-04",
      time: "10:00 - 18:00",
      status: "En attente",
      amount: 600,
    },
    {
      id: "RES-008",
      client: "Camille Moreau",
      boat: "Bateau à moteur Rapide",
      date: "2025-05-04",
      time: "09:00 - 13:00",
      status: "Confirmée",
      amount: 320,
    },
    {
      id: "RES-009",
      client: "Antoine Girard",
      boat: "Voilier Étoile de Mer",
      date: "2025-05-05",
      time: "14:00 - 18:00",
      status: "En attente",
      amount: 250,
    },
    {
      id: "RES-010",
      client: "Julie Lambert",
      boat: "Yacht Océan",
      date: "2025-05-05",
      time: "09:00 - 17:00",
      status: "Confirmée",
      amount: 600,
    },
  ])

  const displayedReservations = showAll ? reservations : reservations.slice(0, 5)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmée":
        return <Badge className="bg-green-500">Confirmée</Badge>
      case "En cours":
        return <Badge className="bg-blue-500">En cours</Badge>
      case "En attente":
        return <Badge className="bg-amber-500">En attente</Badge>
      case "Annulée":
        return <Badge className="bg-red-500">Annulée</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Bateau</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Horaire</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedReservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.id}</TableCell>
                <TableCell>{reservation.client}</TableCell>
                <TableCell>{reservation.boat}</TableCell>
                <TableCell>{new Date(reservation.date).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>{reservation.time}</TableCell>
                <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                <TableCell className="text-right">{reservation.amount} $</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Voir détails</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Modifier</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Facture</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Annuler</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!showAll && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm">
            Voir toutes les réservations
          </Button>
        </div>
      )}
    </div>
  )
}
