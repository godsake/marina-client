"use client"

import { useState } from "react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Settings, LogOut, HelpCircle, User, Plus } from "lucide-react"
import { useAdmin } from "@/context/admin-context"
import { cn } from "@/lib/utils"

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const { user } = useAdmin()

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
    const section = pathname.split("/").filter(Boolean)[1]

    const actionButtons: Record<string, { label: string; href: string }> = {
      boats: { label: "Ajouter un bateau", href: "/admin/boats/manage" },
      reservations: { label: "Nouvelle réservation", href: "/admin/reservations/new" },
      clients: { label: "Ajouter un client", href: "/admin/clients/new" },
      payments: { label: "Nouvelle transaction", href: "/admin/payments/new" },
    }

    return actionButtons[section]
  }

  const actionButton = getActionButton()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <h1
          className={cn(
            "text-lg font-semibold transition-opacity",
            pathname === "/admin" ? "opacity-100" : "hidden opacity-0 lg:block lg:opacity-100",
          )}
        >
          {getPageTitle()}
        </h1>
        <div className="relative lg:w-64 xl:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="h-9 w-full pl-8 lg:max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actionButton && (
          <Button asChild size="sm" className="hidden sm:flex">
            <Link href={actionButton.href}>
              <Plus className="mr-1 h-4 w-4" />
              {actionButton.label}
            </Link>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Paramètres</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Mon profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Aide</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || ""} alt={user?.name || "Admin"} />
                <AvatarFallback>{user?.name?.substring(0, 2) || "AD"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
