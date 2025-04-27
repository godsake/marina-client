import Link from "next/link"
import { Anchor, Facebook, Instagram, Mail, MapPin, Phone, Ship, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-ocean-dark to-teal-dark py-12 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 overflow-hidden transform rotate-180">
        <div className="animate-wave h-4 w-[200%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMTQwIDM0Ij48cGF0aCBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIGQ9Ik0wLDBoMTE0MHYzNGMtMTkuMzgsNC44Ni00MC4wNiw4LjM0LTYyLDEwLjM0Yy00NC4xMyw0LTg2LjIxLDEuNzQtMTIzLjA5LTMuODJjLTM2Ljg4LTUuNTYtNjguMzYtMTQuNTQtMTAyLjU0LTE0LjU0Yy0zNC4xOCwwLTY1LjY2LDguOTgtMTAyLjU0LDE0LjU0Yy0zNi44OCw1LjU2LTc4Ljk2LDcuODItMTIzLjA5LDMuODJjLTQ0LjEzLTQtODYuMjEtMTYuOTQtMTIzLjA5LTIyLjVDNDY2Ljc3LDE2LjI4LDQzNS4yOSwxMC44LDQwMS4xMSwxMC44Yy0zNC4xOCwwLTY1LjY2LDUuNDgtMTAyLjU0LDExLjA0QzI2MS42OSwyNy40LDIxOS42MSw0MC4zNCwxNzUuNDgsNDQuMzRjLTQ0LjEzLDQtODYuMjEsMS43NC0xMjMuMDktMy44MkMxNS41MSwzNC45Niw3LjU3LDMyLjYzLDAsMzBWMHoiPjwvcGF0aD48L3N2Zz4=')] opacity-70"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center mb-4">
              <Ship className="mr-2 h-6 w-6 text-aqua-light" />
              <h3 className="text-lg font-bold">Location de Bateaux</h3>
            </div>
            <p className="mb-4 text-aqua-light/80">
              Profitez d'une expérience nautique exceptionnelle avec notre flotte de bateaux de qualité.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white hover:text-aqua-light transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white hover:text-aqua-light transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white hover:text-aqua-light transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Liens Rapides</h3>
            <ul className="space-y-2 text-aqua-light/80">
              <li>
                <Link href="/" className="hover:text-white flex items-center">
                  <Anchor className="mr-2 h-4 w-4" />
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white flex items-center">
                  <Anchor className="mr-2 h-4 w-4" />
                  Nos Bateaux
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white flex items-center">
                  <Anchor className="mr-2 h-4 w-4" />
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white flex items-center">
                  <Anchor className="mr-2 h-4 w-4" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Contact</h3>
            <address className="not-italic text-aqua-light/80 space-y-2">
              <p className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-aqua-light" />
                123 Rue du Lac
              </p>
              <p className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-aqua-light invisible" />
                Québec, Canada
              </p>
              <p className="flex items-center mt-2">
                <Mail className="mr-2 h-4 w-4 text-aqua-light" />
                info@boatrentals.com
              </p>
              <p className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-aqua-light" />
                (123) 456-7890
              </p>
            </address>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-8 text-center text-aqua-light/60">
          <p>&copy; {new Date().getFullYear()} Location de Bateaux. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
