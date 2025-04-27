"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Plus, RefreshCw, Search } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export function BoatsHeader() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    // Simuler un chargement
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Simple version for server-side rendering
  if (!mounted) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Bateaux</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualiser
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button size="sm" disabled>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un bateau
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher un bateau..." className="pl-8" disabled />
          </div>
          <Select disabled>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
          </Select>
          <Select disabled>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
          </Select>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gestion des Bateaux</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin/boats/manage">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un bateau
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un bateau..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="rented">En location</SelectItem>
            <SelectItem value="maintenance">En maintenance</SelectItem>
            <SelectItem value="outofservice">Hors service</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="sailboat">Voilier</SelectItem>
            <SelectItem value="yacht">Yacht</SelectItem>
            <SelectItem value="catamaran">Catamaran</SelectItem>
            <SelectItem value="motorboat">Bateau à moteur</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
