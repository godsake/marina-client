"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminTopNav() {
  const pathname = usePathname() || ""
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only run on client side
  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Avoid rendering with server-side data that might not match client state
  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-primary p-1">
              <Ship className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Marina Admin</span>
          </div>
        </div>
      </header>
    )
  }

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

  // Mobile navigation drawer
  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <Ship className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Marina Admin</span>
          </Link>
        </div>
        <div className="py-4">
          <nav className="flex flex-col gap-1 px-2">
            {navigationItems.map((item, index) => (
              <div key={index} className="flex flex-col">
                {item.subItems ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between",
                          item.active && "bg-accent text-accent-foreground font-medium",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {item.icon}
                          {item.title}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" alignOffset={-4} className="w-[200px]">
                      {item.subItems.map((subItem, subIndex) => (
                        <DropdownMenuItem key={subIndex} asChild>
                          <Link
                            href={subItem.href}
                            className={cn(subItem.active && "bg-accent text-accent-foreground font-medium")}
                          >
                            {subItem.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href={item.href} passHref>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        item.active && "bg-accent text-accent-foreground font-medium",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        {item.title}
                      </span>
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/admin.png" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Admin User</span>
                <span className="text-xs text-muted-foreground">Administrateur</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <Ship className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold hidden md:inline">Marina Admin</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="ml-auto lg:hidden">
          <MobileNav />
        </div>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
          <ul className="flex items-center gap-1">
            {navigationItems.map((item, index) => (
              <li key={index}>
                {item.subItems ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn("h-9 px-3", item.active && "bg-accent text-accent-foreground font-medium")}
                      >
                        <span className="flex items-center gap-2">
                          {item.icon}
                          <span className="hidden xl:inline">{item.title}</span>
                        </span>
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-[180px]">
                      {item.subItems.map((subItem, subIndex) => (
                        <DropdownMenuItem key={subIndex} asChild>
                          <Link
                            href={subItem.href}
                            className={cn(subItem.active && "bg-accent text-accent-foreground font-medium")}
                          >
                            {subItem.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href={item.href} passHref>
                    <Button
                      variant="ghost"
                      className={cn("h-9 px-3", item.active && "bg-accent text-accent-foreground font-medium")}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        <span className="hidden xl:inline">{item.title}</span>
                      </span>
                    </Button>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User profile on desktop */}
        <div className="hidden lg:flex lg:items-center lg:ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/admin.png" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="hidden xl:inline text-sm font-medium">Admin User</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profil</DropdownMenuItem>
              <DropdownMenuItem>Paramètres</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
