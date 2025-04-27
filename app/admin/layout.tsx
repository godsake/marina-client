import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Toaster } from "@/components/ui/toaster"
import { AdminProvider } from "@/context/admin-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Administration Marina | Tableau de bord",
  description: "Système de gestion pour l'administration de la marina",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div className={`min-h-screen bg-gray-100 ${inter.className}`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="w-full px-2 md:px-4">{children}</div>
            </main>
          </div>
        </div>
        <Toaster />
      </div>
    </AdminProvider>
  )
}
