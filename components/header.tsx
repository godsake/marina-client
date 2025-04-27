"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Anchor, Menu, Ship, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="relative bg-gradient-to-r from-ocean-dark via-ocean-DEFAULT to-aqua-dark text-white shadow-lg">
      <div className="absolute bottom-0 left-0 right-0 h-2 overflow-hidden">
        <div className="animate-wave h-4 w-[200%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMTQwIDM0Ij48cGF0aCBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIGQ9Ik0wLDBoMTE0MHYzNGMtMTkuMzgsNC44Ni00MC4wNiw4LjM0LTYyLDEwLjM0Yy00NC4xMyw0LTg2LjIxLDEuNzQtMTIzLjA5LTMuODJjLTM2Ljg4LTUuNTYtNjguMzYtMTQuNTQtMTAyLjU0LTE0LjU0Yy0zNC4xOCwwLTY1LjY2LDguOTgtMTAyLjU0LDE0LjU0Yy0zNi44OCw1LjU2LTc4Ljk2LDcuODItMTIzLjA5LDMuODJjLTQ0LjEzLTQtODYuMjEtMTYuOTQtMTIzLjA5LTIyLjVDNDY2Ljc3LDE2LjI4LDQzNS4yOSwxMC44LDQwMS4xMSwxMC44Yy0zNC4xOCwwLTY1LjY2LDUuNDgtMTAyLjU0LDExLjA0QzI2MS42OSwyNy40LDIxOS42MSw0MC4zNCwxNzUuNDgsNDQuMzRjLTQ0LjEzLDQtODYuMjEsMS43NC0xMjMuMDktMy44MkMxNS41MSwzNC45Niw3LjU3LDMyLjYzLDAsMzBWMHoiPjwvcGF0aD48L3N2Zz4=')] opacity-70"></div>
      </div>

      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center text-xl font-bold text-white">
          <Ship className="mr-2 h-6 w-6" />
          <span className="relative">
            Boat Rentals
            <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-aqua-light"></span>
          </span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <Link href="/" className="text-white hover:text-aqua-light transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="#" className="text-white hover:text-aqua-light transition-colors">
                Nos Bateaux
              </Link>
            </li>
            <li>
              <Link href="#" className="text-white hover:text-aqua-light transition-colors">
                Tarifs
              </Link>
            </li>
            <li>
              <Link href="#" className="text-white hover:text-aqua-light transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <Button className="hidden md:inline-flex bg-aqua-light hover:bg-white hover:text-ocean-dark text-ocean-dark font-medium transition-all">
          <Anchor className="mr-2 h-4 w-4" />
          Réserver maintenant
        </Button>

        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-white/20 md:hidden">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-4">
              <li>
                <Link href="/" className="block text-white hover:text-aqua-light" onClick={() => setIsMenuOpen(false)}>
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="#" className="block text-white hover:text-aqua-light" onClick={() => setIsMenuOpen(false)}>
                  Nos Bateaux
                </Link>
              </li>
              <li>
                <Link href="#" className="block text-white hover:text-aqua-light" onClick={() => setIsMenuOpen(false)}>
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="#" className="block text-white hover:text-aqua-light" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
              </li>
              <li>
                <Button className="w-full bg-aqua-light hover:bg-white hover:text-ocean-dark text-ocean-dark font-medium">
                  <Anchor className="mr-2 h-4 w-4" />
                  Réserver maintenant
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
