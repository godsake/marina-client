"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Ship,
  Calendar,
  Users,
  CreditCard,
  PenToolIcon as Tool,
  Bell,
  BarChart,
  Shield,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"

interface SidebarItemProps {
  title: string
  icon: React.ReactNode
  href?: string
  items?: {
    title: string
    href: string
  }[]
  isActive?: boolean
}

function SidebarItem({ title, icon, href, items, isActive }: SidebarItemProps) {
  const [expanded, setExpanded] = useState(isActive)
  const pathname = usePathname()

  const isItemActive = (itemHref: string) => {
    return pathname === itemHref
  }

  const isMainActive = href ? isItemActive(href) : items?.some((item) => isItemActive(item.href))

  return (
    <div className="mb-1">
      {href ? (
        <Link href={href} passHref>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 font-normal",
              isMainActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {icon}
            {title}
          </Button>
        </Link>
      ) : (
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between font-normal",
              isMainActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
            )}
            onClick={() => setExpanded(!expanded)}
          >
            <span className="flex items-center gap-2">
              {icon}
              {title}
            </span>
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
          {expanded && items && (
            <div className="ml-6 space-y-1 border-l pl-2">
              {items.map((item, index) => (
                <Link key={index} href={item.href} passHref>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sm font-normal",
                      isItemActive(item.href)
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {item.title}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const sidebarItems = [
    {
      title: "Tableau de bord",
      icon: <Ship size={18} />,
      href: "/admin",
    },
    {
      title: "Gestion des Bateaux",
      icon: <Ship size={18} />,
      items: [
        { title: "Liste des bateaux", href: "/admin/boats" },
        { title: "Ajout/Modification bateau", href: "/admin/boats/manage" },
        { title: "État et disponibilité", href: "/admin/boats/status" },
        { title: "Historique d'utilisation", href: "/admin/boats/history" },
      ],
    },
    {
      title: "Gestion des Locations",
      icon: <Calendar size={18} />,
      items: [
        { title: "Réservations en cours", href: "/admin/reservations" },
        { title: "Nouvelle réservation", href: "/admin/reservations/new" },
        { title: "Calendrier des disponibilités", href: "/admin/reservations/calendar" },
        { title: "Annulations/Modifications", href: "/admin/reservations/manage" },
      ],
    },
    {
      title: "Gestion des Clients",
      icon: <Users size={18} />,
      items: [
        { title: "Liste des clients", href: "/admin/clients" },
        { title: "Profil client", href: "/admin/clients/profile" },
        { title: "Historique des locations", href: "/admin/clients/history" },
        { title: "Gestion des avis", href: "/admin/clients/reviews" },
      ],
    },
    {
      title: "Gestion des Paiements",
      icon: <CreditCard size={18} />,
      items: [
        { title: "Transactions", href: "/admin/payments" },
        { title: "Factures", href: "/admin/payments/invoices" },
        { title: "Remboursements", href: "/admin/payments/refunds" },
        { title: "Rapports financiers", href: "/admin/payments/reports" },
      ],
    },
    {
      title: "Gestion de la Maintenance",
      icon: <Tool size={18} />,
      items: [
        { title: "Planification maintenance", href: "/admin/maintenance" },
        { title: "Suivi des réparations", href: "/admin/maintenance/repairs" },
        { title: "Historique maintenance", href: "/admin/maintenance/history" },
        { title: "Alertes techniques", href: "/admin/maintenance/alerts" },
      ],
    },
    {
      title: "Notifications",
      icon: <Bell size={18} />,
      items: [
        { title: "Envoi confirmations", href: "/admin/notifications" },
        { title: "Rappels automatiques", href: "/admin/notifications/reminders" },
        { title: "Alertes internes", href: "/admin/notifications/alerts" },
        { title: "Modèles de messages", href: "/admin/notifications/templates" },
      ],
    },
    {
      title: "Rapports et Analyses",
      icon: <BarChart size={18} />,
      items: [
        { title: "Réservations par période", href: "/admin/reports" },
        { title: "Taux d'occupation", href: "/admin/reports/occupancy" },
        { title: "Performances financières", href: "/admin/reports/financial" },
        { title: "Statistiques clients", href: "/admin/reports/clients" },
      ],
    },
    {
      title: "Sécurité et Conformité",
      icon: <Shield size={18} />,
      items: [
        { title: "Contrats de location", href: "/admin/security" },
        { title: "Vérification licences", href: "/admin/security/licenses" },
        { title: "Gestion des assurances", href: "/admin/security/insurance" },
        { title: "Conformité RGPD", href: "/admin/security/gdpr" },
      ],
    },
  ]

  return (
    <>
      <div className="fixed top-0 left-0 z-40 md:hidden p-4">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(true)} aria-label="Ouvrir le menu">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/admin" className="flex items-center gap-2 font-semibold text-lg">
            <Ship className="h-6 w-6" />
            <span>Marina Admin</span>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-3 py-2">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                title={item.title}
                icon={item.icon}
                href={item.href}
                items={item.items}
                isActive={item.href === pathname || item.items?.some((subItem) => pathname.startsWith(subItem.href))}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
