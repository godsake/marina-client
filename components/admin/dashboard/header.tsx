"use client"

import { Button } from "@/components/ui/button"
import { Download, Plus, RefreshCw } from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { useState } from "react"

export function DashboardHeader() {
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    // Simuler un chargement
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <DatePickerWithRange className="w-full sm:w-auto" />
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="flex-shrink-0">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
          <Button size="sm" className="flex-shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Nouvelle réservation</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
