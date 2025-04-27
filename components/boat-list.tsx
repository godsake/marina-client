"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { BoatCard } from "@/components/boat-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, RefreshCw } from "lucide-react"
import type { Boat } from "@/types/boat"

interface BoatListProps {
  boats: Boat[]
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

// Système de réponses locales pour simuler le chatbot
const localResponses = [
  {
    keywords: ["bonjour", "salut", "hello", "hi"],
    response: "Bonjour ! Comment puis-je vous aider à trouver un bateau aujourd'hui ?",
    filter: null,
  },
  {
    keywords: ["voilier", "voile"],
    response:
      "Voici nos voiliers disponibles. Ils sont parfaits pour profiter du vent et de la mer en toute tranquillité.",
    filter: (boat: Boat) => boat.type.toLowerCase().includes("voilier"),
  },
  {
    keywords: ["yacht", "luxe"],
    response:
      "Nos yachts sont disponibles pour une expérience de navigation luxueuse. Ils offrent confort et élégance.",
    filter: (boat: Boat) => boat.type.toLowerCase().includes("yacht"),
  },
  {
    keywords: ["catamaran"],
    response: "Les catamarans offrent stabilité et espace. Parfaits pour les sorties en famille ou entre amis.",
    filter: (boat: Boat) => boat.type.toLowerCase().includes("catamaran"),
  },
  {
    keywords: ["moteur", "rapide", "vitesse"],
    response: "Nos bateaux à moteur sont idéaux pour les amateurs de vitesse et de sensations fortes.",
    filter: (boat: Boat) => boat.type.toLowerCase().includes("moteur"),
  },
  {
    keywords: ["prix", "tarif", "coût", "combien"],
    response:
      "Nos tarifs varient selon le type de bateau et la durée de location. Vous pouvez voir les prix détaillés sur chaque fiche bateau.",
    filter: null,
  },
  {
    keywords: ["réserver", "reservation", "louer", "location"],
    response:
      "Pour réserver un bateau, cliquez sur la fiche du bateau qui vous intéresse puis sur le bouton 'Réserver'.",
    filter: null,
  },
  {
    keywords: ["capacité", "personnes", "passagers"],
    response:
      "Nos bateaux peuvent accueillir de 2 à 12 personnes selon le modèle. Vous pouvez voir la capacité exacte sur chaque fiche.",
    filter: null,
  },
  {
    keywords: ["petit", "2", "3", "4"],
    response: "Voici nos bateaux adaptés pour de petits groupes.",
    filter: (boat: Boat) => boat.capacity <= 4,
  },
  {
    keywords: ["grand", "groupe", "famille", "8", "10", "12"],
    response: "Ces bateaux sont parfaits pour les grands groupes ou les familles.",
    filter: (boat: Boat) => boat.capacity >= 8,
  },
  {
    keywords: ["weekend", "fin de semaine"],
    response:
      "Tous nos bateaux sont disponibles pour des locations le weekend. Les tarifs weekend sont indiqués sur chaque fiche.",
    filter: null,
  },
  {
    keywords: ["durée", "temps", "heures", "journée"],
    response: "Nous proposons des locations de 4h, 6h ou 8h selon vos besoins.",
    filter: null,
  },
  {
    keywords: ["permis", "licence"],
    response:
      "Certains de nos bateaux nécessitent un permis bateau. N'hésitez pas à nous demander plus d'informations lors de la réservation.",
    filter: null,
  },
]

export function BoatList({ boats }: BoatListProps) {
  const [filteredBoats, setFilteredBoats] = useState<Boat[]>([])
  const [mounted, setMounted] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Set mounted state on client side
  useEffect(() => {
    setMounted(true)
    setFilteredBoats(boats)

    // Ajouter un message de bienvenue
    setMessages([
      {
        role: "assistant",
        content:
          "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider à trouver un bateau aujourd'hui ?",
      },
    ])
  }, [boats])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Fonction pour trouver une réponse locale basée sur les mots-clés
  const findLocalResponse = (input: string) => {
    const lowercaseInput = input.toLowerCase()

    // Chercher une correspondance dans les réponses locales
    for (const item of localResponses) {
      if (item.keywords.some((keyword) => lowercaseInput.includes(keyword))) {
        return {
          response: item.response,
          filter: item.filter,
        }
      }
    }

    // Réponse par défaut si aucune correspondance
    return {
      response:
        "Je ne suis pas sûr de comprendre votre demande. Pouvez-vous préciser ce que vous recherchez ? Par exemple, vous pouvez me demander des informations sur les voiliers, les yachts, ou les bateaux à moteur.",
      filter: null,
    }
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    // Add user message to chat
    const userMessage = { role: "user" as const, content: chatInput }
    setMessages((prev) => [...prev, userMessage])

    // Store the question for local processing
    const userQuestion = chatInput

    // Clear input
    setChatInput("")

    // Set loading state
    setIsLoading(true)

    // Simuler un délai de traitement
    setTimeout(() => {
      try {
        // Trouver une réponse locale
        const { response, filter } = findLocalResponse(userQuestion)

        // Ajouter la réponse au chat
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response,
          },
        ])

        // Filtrer les bateaux si nécessaire
        if (filter) {
          setFilteredBoats(boats.filter(filter))
        } else {
          // Si pas de filtre spécifique, vérifier si la question contient des mots généraux
          const lowercaseQuestion = userQuestion.toLowerCase()

          // Recherche générale basée sur le texte
          if (
            lowercaseQuestion.includes("tous") ||
            lowercaseQuestion.includes("tout") ||
            lowercaseQuestion.includes("disponible") ||
            lowercaseQuestion.includes("liste")
          ) {
            setFilteredBoats(boats)
          }
        }
      } catch (error) {
        console.error("Erreur lors du traitement de la demande:", error)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Désolé, une erreur est survenue lors du traitement de votre demande.",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }, 800) // Délai simulé pour donner l'impression d'un traitement
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const resetFilters = () => {
    setFilteredBoats(boats)
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "J'ai réinitialisé les filtres. Voici tous nos bateaux disponibles.",
      },
    ])
  }

  // Avoid hydration mismatch by rendering a simpler version on server
  if (!mounted) {
    return (
      <div>
        <div className="mb-3 h-[300px] border rounded-lg bg-gray-50"></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {boats.map((boat) => (
            <BoatCard key={boat.id} boat={boat} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-3">
        <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
          <div className="flex justify-between items-center px-3 py-2 border-b">
            <h3 className="text-sm font-medium text-ocean-dark">Assistant de recherche</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-7 text-xs"
              title="Réinitialiser les filtres"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Réinitialiser
            </Button>
          </div>
          <div ref={chatContainerRef} className="h-[250px] p-3 overflow-y-auto flex flex-col gap-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-2 rounded-lg ${
                  msg.role === "user" ? "bg-ocean-light text-white self-end" : "bg-gray-100 text-gray-800 self-start"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-gray-100 text-gray-800 self-start max-w-[80%] p-2 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          <div className="border-t p-2 flex gap-2">
            <Input
              type="text"
              placeholder="Posez une question sur nos bateaux..."
              className="h-9 text-sm"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="button"
              size="sm"
              className="bg-ocean-dark hover:bg-ocean-dark/90"
              onClick={handleSendMessage}
              disabled={isLoading || !chatInput.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBoats.map((boat) => (
          <BoatCard key={boat.id} boat={boat} />
        ))}
      </div>

      {filteredBoats.length === 0 && (
        <div className="mt-4 text-center p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-500">Aucun bateau ne correspond à votre recherche.</p>
          <Button variant="link" size="sm" onClick={resetFilters} className="mt-2 text-ocean-dark">
            Afficher tous les bateaux
          </Button>
        </div>
      )}
    </div>
  )
}
