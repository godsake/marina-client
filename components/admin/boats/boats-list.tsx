"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  PenToolIcon as Tool,
  Ship,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Helper functions for generating random data
const getRandomStatus = () => {
  const statuses = ["Disponible", "En location", "En maintenance", "Hors service"]
  return statuses[Math.floor(Math.random() * statuses.length)]
}

const getRandomPastDate = () => {
  const today = new Date()
  const pastDate = new Date(today)
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * 90)) // Random date within last 90 days
  return pastDate.toISOString().split("T")[0]
}

const getRandomFutureDate = () => {
  const today = new Date()
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 90) + 30) // Random date 30-120 days in future
  return futureDate.toISOString().split("T")[0]
}

interface BoatsListProps {
  initialBoats?: any[]
}

export function BoatsList({ initialBoats = [] }: BoatsListProps) {
  const [boats, setBoats] = useState(
    initialBoats.length > 0
      ? initialBoats.map((boat) => ({
          ...boat,
          status: boat.status || getRandomStatus(),
          lastMaintenance: boat.lastMaintenance || getRandomPastDate(),
          nextMaintenance: boat.nextMaintenance || getRandomFutureDate(),
        }))
      : [
          {
            id: "BOAT-001",
            name: "Voilier Étoile de Mer",
            type: "Voilier",
            capacity: 6,
            status: "Disponible",
            lastMaintenance: "2025-04-15",
            nextMaintenance: "2025-07-15",
            image_url: "/serene-coastal-sail.png",
            pricing: {
              "4h": 150,
              "6h": 200,
              "8h": 250,
            },
          },
          {
            id: "BOAT-002",
            name: "Yacht Océan",
            type: "Yacht",
            capacity: 10,
            status: "En location",
            lastMaintenance: "2025-03-20",
            nextMaintenance: "2025-06-20",
            image_url: "/luxury-yacht-sunset.png",
            pricing: {
              "4h": 300,
              "6h": 400,
              "8h": 500,
            },
          },
          {
            id: "BOAT-003",
            name: "Catamaran Horizon",
            type: "Catamaran",
            capacity: 8,
            status: "Disponible",
            lastMaintenance: "2025-04-01",
            nextMaintenance: "2025-07-01",
            image_url: "/tropical-catamaran-cruise.png",
            pricing: {
              "4h": 200,
              "6h": 300,
              "8h": 400,
            },
          },
          {
            id: "BOAT-004",
            name: "Bateau à moteur Rapide",
            type: "Bateau à moteur",
            capacity: 4,
            status: "En maintenance",
            lastMaintenance: "2025-04-25",
            nextMaintenance: "2025-07-25",
            image_url: "/lake-adventure.png",
            pricing: {
              "4h": 120,
              "6h": 180,
              "8h": 240,
            },
          },
          {
            id: "BOAT-005",
            name: "Voilier Brise Marine",
            type: "Voilier",
            capacity: 5,
            status: "Hors service",
            lastMaintenance: "2025-02-10",
            nextMaintenance: "2025-05-10",
            image_url: "/blue-sailboat-on-calm-sea.png",
            pricing: {
              "4h": 140,
              "6h": 190,
              "8h": 240,
            },
          },
        ],
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Disponible":
        return <Badge className="bg-green-500">Disponible</Badge>
      case "En location":
        return <Badge className="bg-blue-500">En location</Badge>
      case "En maintenance":
        return <Badge className="bg-amber-500">En maintenance</Badge>
      case "Hors service":
        return <Badge className="bg-red-500">Hors service</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Disponible":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "En location":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "En maintenance":
        return <Tool className="h-5 w-5 text-amber-500" />
      case "Hors service":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Ship className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Vue tableau pour écrans moyens et grands */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dernière maintenance</TableHead>
              <TableHead>Prochaine maintenance</TableHead>
              <TableHead className="text-right">Prix (4h)</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boats.map((boat) => (
              <TableRow key={boat.id}>
                <TableCell>
                  <div className="relative h-12 w-16 overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={boat.image_url || "/placeholder.svg"}
                      alt={boat.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback en cas d'erreur de chargement de l'image
                        e.currentTarget.src = "/lakeside-rowboat.png"
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{boat.id}</TableCell>
                <TableCell>{boat.name}</TableCell>
                <TableCell>{boat.type}</TableCell>
                <TableCell>{boat.capacity} personnes</TableCell>
                <TableCell>{getStatusBadge(boat.status)}</TableCell>
                <TableCell>{new Date(boat.lastMaintenance).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>{new Date(boat.nextMaintenance).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell className="text-right">{boat.pricing["4h"]} $</TableCell>
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
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/boats/${boat.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Voir détails</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/boats/manage?id=${boat.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Modifier</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/maintenance?boat=${boat.id}`}>
                          <Tool className="mr-2 h-4 w-4" />
                          <span>Maintenance</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/reservations/new?boat=${boat.id}`}>
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Réserver</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Supprimer</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Vue carte pour petits écrans */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {boats.map((boat) => (
          <Card key={boat.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={boat.image_url || "/placeholder.svg"}
                    alt={boat.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback en cas d'erreur de chargement de l'image
                      e.currentTarget.src = "/lakeside-rowboat.png"
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{boat.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/boats/${boat.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Voir détails</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/boats/manage?id=${boat.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Modifier</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/maintenance?boat=${boat.id}`}>
                            <Tool className="mr-2 h-4 w-4" />
                            <span>Maintenance</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/reservations/new?boat=${boat.id}`}>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Réserver</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Supprimer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="text-xs text-muted-foreground">{boat.id}</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>{boat.type}</span>
                    <span>•</span>
                    <span>{boat.capacity} personnes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(boat.status)}
                      <span className="text-sm">{boat.status}</span>
                    </div>
                    <div className="text-sm font-medium">{boat.pricing["4h"]} $ (4h)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
