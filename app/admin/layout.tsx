import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
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
      <div className={`min-h-screen bg-background ${inter.className}`}>
        <div className="flex min-h-screen flex-col lg:flex-row">
          <AdminSidebar />
          <div className="flex flex-1 flex-col">
            <AdminHeader />
            <main className="flex-1 overflow-auto p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6">
              <div className="mx-auto w-full max-w-full sm:max-w-[95%] md:max-w-[92%] lg:max-w-[90%] xl:max-w-[1600px]">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
      <Toaster />
    </AdminProvider>
  )
}
