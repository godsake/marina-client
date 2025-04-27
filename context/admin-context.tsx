"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface AdminContextType {
  sidebarOpen: boolean
  toggleSidebar: () => void
  user: {
    name: string
    email: string
    role: string
    avatar?: string
  } | null
  setUser: (user: AdminContextType["user"]) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<AdminContextType["user"]>({
    name: "Admin User",
    email: "admin@marina.com",
    role: "Administrateur",
    avatar: "/avatars/admin.png",
  })

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <AdminContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        user,
        setUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
