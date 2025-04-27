"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 1200,
  },
  {
    name: "Fév",
    total: 1900,
  },
  {
    name: "Mar",
    total: 2800,
  },
  {
    name: "Avr",
    total: 3800,
  },
  {
    name: "Mai",
    total: 4800,
  },
  {
    name: "Juin",
    total: 5800,
  },
  {
    name: "Juil",
    total: 7800,
  },
  {
    name: "Août",
    total: 8800,
  },
  {
    name: "Sep",
    total: 6800,
  },
  {
    name: "Oct",
    total: 4800,
  },
  {
    name: "Nov",
    total: 3800,
  },
  {
    name: "Déc",
    total: 2800,
  },
]

export function Overview() {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={(value: number) => [`$${value}`, "Revenus"]}
            labelFormatter={(label) => `Mois: ${label}`}
          />
          <Bar dataKey="total" fill="#0369a1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
