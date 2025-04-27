"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const data = [
  { name: "Disponible", value: 12, color: "#22c55e" },
  { name: "En location", value: 8, color: "#3b82f6" },
  { name: "En maintenance", value: 3, color: "#f59e0b" },
  { name: "Hors service", value: 2, color: "#ef4444" },
]

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"]

interface BoatStatusProps {
  showDetails?: boolean
}

export function BoatStatus({ showDetails = false }: BoatStatusProps) {
  return (
    <div className="space-y-4">
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={showDetails ? 40 : 60}
              outerRadius={showDetails ? 80 : 90}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} bateaux`, ""]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {showDetails && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {data.map((status, index) => (
              <Card key={index}>
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <div className="text-2xl font-bold">{status.value}</div>
                  <div className="text-sm text-muted-foreground">{status.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Bateaux par statut</h3>
            <div className="space-y-2">
              {[
                { name: "Voilier Étoile de Mer", status: "Disponible" },
                { name: "Yacht Océan", status: "En location" },
                { name: "Catamaran Horizon", status: "Disponible" },
                { name: "Bateau à moteur Rapide", status: "En maintenance" },
                { name: "Voilier Brise Marine", status: "Hors service" },
              ].map((boat, index) => (
                <div key={index} className="flex items-center justify-between rounded-md border p-2">
                  <span>{boat.name}</span>
                  <Badge
                    variant="outline"
                    className={`
                      ${boat.status === "Disponible" ? "border-green-500 text-green-500" : ""}
                      ${boat.status === "En location" ? "border-blue-500 text-blue-500" : ""}
                      ${boat.status === "En maintenance" ? "border-amber-500 text-amber-500" : ""}
                      ${boat.status === "Hors service" ? "border-red-500 text-red-500" : ""}
                    `}
                  >
                    {boat.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
