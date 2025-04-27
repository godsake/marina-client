"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, Plus } from "lucide-react"

export function AdminHeader() {
  // Initialize with empty string to ensure it's always controlled
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname() || ""

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fonction pour obtenir le titre de la page en fonction du chemin
  const getPageTitle = () => {
    if (pathname === "/admin") return "Tableau de bord"

    const segments = pathname.split("/").filter(Boolean)
    if (segments.length < 2) return ""

    const section = segments[1]

    const sectionTitles: Record<string, string> = {
      boats: "Gestion des Bateaux",
      reservations: "Gestion des Réservations",
      clients: "Gestion des Clients",
      payments: "Gestion des Paiements",
      maintenance: "Gestion de la Maintenance",
      notifications: "Notifications",
      reports: "Rapports et Analyses",
      security: "Sécurité et Conformité",
    }

    return sectionTitles[section] || ""
  }

  const getActionButton = () => {
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length < 2) return null

    const section = segments[1]

    const actionButtons: Record<string, { label: string; href: string }> = {
      boats: { label: "Ajouter un bateau", href: "/admin/boats/manage" },
      reservations: { label: "Nouvelle réservation", href: "/admin/reservations/new" },
      clients: { label: "Ajouter un client", href: "/admin/clients/new" },
      payments: { label: "Nouvelle transaction", href: "/admin/payments/new" },
    }

    return actionButtons[section] || null
  }

  // Avoid rendering with server-side data that might not match client state
  if (!mounted) {
    return (
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Chargement...</h1>
          </div>
        </div>
      </div>
    )
  }

  const actionButton = getActionButton()

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative md:w-64 lg:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="h-9 w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {actionButton && (
            <Button asChild size="sm">
              <Link href={actionButton.href}>
                <Plus className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">{actionButton.label}</span>
                <span className="sm:hidden">Ajouter</span>
              </Link>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative lg:hidden">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                {[1, 2, 3].map((i) => (
                  <DropdownMenuItem key={i} className="cursor-pointer p-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">Nouvelle réservation #{i}</p>
                      <p className="text-xs text-muted-foreground">
                        Une nouvelle réservation a été effectuée pour le bateau Étoile de Mer.
                      </p>
                      <p className="text-xs text-muted-foreground">Il y a {i * 10} minutes</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer justify-center">
                <Link href="/admin/notifications">Voir toutes les notifications</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
