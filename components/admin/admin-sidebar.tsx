"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
  Ship,
  Calendar,
  Users,
  CreditCard,
  PenToolIcon as Tool,
  Bell,
  BarChart,
  Shield,
  Menu,
  LogOut,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAdmin } from "@/context/admin-context"

export function AdminSidebar() {
  const pathname = usePathname()
  const { user } = useAdmin()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const navigationItems = [
    {
      title: "Tableau de bord",
      icon: <Ship className="h-4 w-4" />,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      title: "Bateaux",
      icon: <Ship className="h-4 w-4" />,
      href: "/admin/boats",
      active: pathname.startsWith("/admin/boats"),
      subItems: [
        { title: "Liste des bateaux", href: "/admin/boats", active: pathname === "/admin/boats" },
        { title: "Ajouter un bateau", href: "/admin/boats/manage", active: pathname === "/admin/boats/manage" },
        { title: "État et disponibilité", href: "/admin/boats/status", active: pathname === "/admin/boats/status" },
      ],
    },
    {
      title: "Réservations",
      icon: <Calendar className="h-4 w-4" />,
      href: "/admin/reservations",
      active: pathname.startsWith("/admin/reservations"),
      subItems: [
        { title: "Liste des réservations", href: "/admin/reservations", active: pathname === "/admin/reservations" },
        {
          title: "Nouvelle réservation",
          href: "/admin/reservations/new",
          active: pathname === "/admin/reservations/new",
        },
        {
          title: "Calendrier",
          href: "/admin/reservations/calendar",
          active: pathname === "/admin/reservations/calendar",
        },
      ],
    },
    {
      title: "Clients",
      icon: <Users className="h-4 w-4" />,
      href: "/admin/clients",
      active: pathname.startsWith("/admin/clients"),
    },
    {
      title: "Paiements",
      icon: <CreditCard className="h-4 w-4" />,
      href: "/admin/payments",
      active: pathname.startsWith("/admin/payments"),
    },
    {
      title: "Maintenance",
      icon: <Tool className="h-4 w-4" />,
      href: "/admin/maintenance",
      active: pathname.startsWith("/admin/maintenance"),
    },
    {
      title: "Notifications",
      icon: <Bell className="h-4 w-4" />,
      href: "/admin/notifications",
      active: pathname.startsWith("/admin/notifications"),
    },
    {
      title: "Rapports",
      icon: <BarChart className="h-4 w-4" />,
      href: "/admin/reports",
      active: pathname.startsWith("/admin/reports"),
    },
    {
      title: "Sécurité",
      icon: <Shield className="h-4 w-4" />,
      href: "/admin/security",
      active: pathname.startsWith("/admin/security"),
    },
  ]

  const renderSidebarContent = () => (
    <>
      <SidebarHeader className="border-b px-2 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="rounded-md bg-primary p-1">
            <Ship className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">Marina Admin</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="py-2">
        {navigationItems.map((item, index) => (
          <SidebarGroup key={index} className={index > 0 ? "mt-1 pt-1 border-t border-border/40" : ""}>
            {item.subItems ? (
              <>
                <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground">
                  {item.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.subItems.map((subItem, subIndex) => (
                      <SidebarMenuItem key={subIndex}>
                        <SidebarMenuButton
                          asChild
                          isActive={subItem.active}
                          className="transition-all duration-200 hover:bg-accent/50"
                          tooltip={subItem.title}
                        >
                          <Link href={subItem.href} className="flex items-center">
                            <div className="mr-2 h-4 w-4 opacity-70">{item.icon}</div>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </>
            ) : (
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={item.active}
                      className="transition-all duration-200 hover:bg-accent/50"
                      tooltip={item.title}
                    >
                      <Link href={item.href} className="flex items-center">
                        <div className={`mr-2 h-4 w-4 ${item.active ? "text-primary" : "opacity-70"}`}>{item.icon}</div>
                        <span className={item.active ? "font-medium" : ""}>{item.title}</span>
                        {item.active && (
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-full" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatar || ""} alt={user?.name || "Admin"} />
              <AvatarFallback>{user?.name?.substring(0, 2) || "AD"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name || "Admin"}</span>
              <span className="text-xs text-muted-foreground">{user?.role || "Administrateur"}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </>
  )

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-3 z-40 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <Sidebar collapsible="none" className="border-0">
            {renderSidebarContent()}
          </Sidebar>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar className="hidden border-r lg:block" collapsible="icon">
        {renderSidebarContent()}
        <SidebarTrigger className="absolute -right-3 top-6" />
      </Sidebar>
    </SidebarProvider>
  )
}
