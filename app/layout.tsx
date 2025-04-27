import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Location de Bateaux",
  description: "Réservez votre bateau pour une expérience inoubliable sur l'eau",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="max-w-md mx-auto">{children}</div>
      </body>
    </html>
  )
}
