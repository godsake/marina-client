"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { BoatCard } from "@/components/boat-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, RefreshCw, ThumbsUp, ThumbsDown, Ship, Users, Clock, CreditCard, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Boat } from "@/types/boat"

interface BoatListProps {
  boats: Boat[]
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  feedback?: "positive" | "negative"
  suggestions?: string[]
  filteredBoats?: Boat[]
}

// Types de bateaux pour les suggestions
const boatTypes = ["Voilier", "Yacht", "Catamaran", "Bateau à moteur"]

// Système de réponses locales pour simuler le chatbot
const localResponses = [
  {
    keywords: ["bonjour", "salut", "hello", "hi", "coucou", "hey"],
    response: "Bonjour ! Comment puis-je vous aider à trouver un bateau aujourd'hui ?",
    suggestions: [
      "Quels types de bateaux proposez-vous ?",
      "Je cherche un bateau pour 6 personnes",
      "Quel est le prix d'un voilier ?",
    ],
    filter: null,
  },
  {
    keywords: ["voilier", "voile"],
    response:
      "Voici nos voiliers disponibles. Ils sont parfaits pour profiter du vent et de la mer en toute tranquillité. Souhaitez-vous des informations spécifiques sur l'un d'entre eux ?",
    suggestions: ["Quelle est la capacité des voiliers ?", "Prix d'un voilier pour une journée", "Faut-il un permis ?"],
    filter: (boat: Boat) => boat.type.toLowerCase().includes("voilier"),
  },
  {
    keywords: ["yacht", "luxe"],
    response:
      "Nos yachts sont disponibles pour une expérience de navigation luxueuse. Ils offrent confort et élégance pour des moments inoubliables sur l'eau.",
    suggestions: [
      "Combien de personnes sur un yacht ?",
      "Prix d'un yacht pour une journée",
      "Options disponibles sur les yachts",
    ],
    filter: (boat: Boat) => boat.type.toLowerCase().includes("yacht"),
  },
  {
    keywords: ["catamaran"],
    response:
      "Les catamarans offrent stabilité et espace. Parfaits pour les sorties en famille ou entre amis. Leur double coque assure une navigation confortable même par mer agitée.",
    suggestions: ["Capacité des catamarans", "Prix d'un catamaran", "Avantages d'un catamaran"],
    filter: (boat: Boat) => boat.type.toLowerCase().includes("catamaran"),
  },
  {
    keywords: ["moteur", "rapide", "vitesse", "puissant"],
    response:
      "Nos bateaux à moteur sont idéaux pour les amateurs de vitesse et de sensations fortes. Ils permettent d'explorer rapidement le littoral et d'accéder à des criques isolées.",
    suggestions: ["Puissance des moteurs", "Consommation de carburant", "Location à la demi-journée"],
    filter: (boat: Boat) => boat.type.toLowerCase().includes("moteur"),
  },
  {
    keywords: ["prix", "tarif", "coût", "combien", "cher"],
    response:
      "Nos tarifs varient selon le type de bateau et la durée de location. Les prix commencent à partir de 150€ pour 4 heures sur un petit bateau et peuvent aller jusqu'à 600€ pour une journée complète sur un yacht luxueux. Les tarifs weekend sont légèrement plus élevés.",
    suggestions: ["Prix pour une journée", "Différence de prix weekend/semaine", "Y a-t-il des réductions ?"],
    filter: null,
  },
  {
    keywords: ["réserver", "reservation", "louer", "location", "disponibilité"],
    response:
      "Pour réserver un bateau, cliquez sur la fiche du bateau qui vous intéresse puis sur le bouton 'Réserver'. Vous pourrez ensuite choisir la date, l'horaire et la durée de votre location. Un système de paiement sécurisé vous sera proposé.",
    suggestions: ["Politique d'annulation", "Documents nécessaires", "Caution demandée"],
    filter: null,
  },
  {
    keywords: ["capacité", "personnes", "passagers", "places"],
    response:
      "Nos bateaux peuvent accueillir de 2 à 12 personnes selon le modèle. Les voiliers ont généralement une capacité de 4 à 8 personnes, les yachts de 6 à 12, et les bateaux à moteur de 2 à 6 personnes.",
    suggestions: ["Bateaux pour 8 personnes", "Bateaux pour petits groupes", "Bateau le plus spacieux"],
    filter: null,
  },
  {
    keywords: ["petit", "2", "3", "4", "couple"],
    response:
      "Voici nos bateaux adaptés pour de petits groupes. Ils sont parfaits pour les couples ou les petites familles souhaitant une expérience plus intime.",
    suggestions: ["Prix des petits bateaux", "Facilité de navigation", "Besoin d'un permis ?"],
    filter: (boat: Boat) => boat.capacity <= 4,
  },
  {
    keywords: ["grand", "groupe", "famille", "8", "10", "12", "nombreux"],
    response:
      "Ces bateaux sont parfaits pour les grands groupes ou les familles. Ils offrent suffisamment d'espace pour que chacun puisse profiter confortablement de la sortie en mer.",
    suggestions: ["Équipements à bord", "Espaces ombragés", "Possibilité de cuisiner à bord"],
    filter: (boat: Boat) => boat.capacity >= 8,
  },
  {
    keywords: ["weekend", "fin de semaine", "samedi", "dimanche"],
    response:
      "Tous nos bateaux sont disponibles pour des locations le weekend. Les tarifs weekend sont légèrement plus élevés (environ 20%) en raison de la forte demande. Je vous conseille de réserver à l'avance pour garantir la disponibilité.",
    suggestions: ["Disponibilités ce weekend", "Horaires de prise en charge", "Durées disponibles"],
    filter: null,
  },
  {
    keywords: ["durée", "temps", "heures", "journée", "demi-journée", "combien de temps"],
    response:
      "Nous proposons des locations de 4h (demi-journée), 6h ou 8h (journée complète) selon vos besoins. Les créneaux de 4h sont généralement le matin (9h-13h) ou l'après-midi (14h-18h).",
    suggestions: ["Prix pour 4h", "Prix pour la journée", "Horaires flexibles ?"],
    filter: null,
  },
  {
    keywords: ["permis", "licence", "conduire", "capitaine", "skipper"],
    response:
      "Certains de nos bateaux nécessitent un permis bateau, notamment les plus puissants. Cependant, nous proposons aussi des options sans permis avec une puissance limitée. Pour les grands yachts, nous pouvons fournir un skipper professionnel moyennant un supplément.",
    suggestions: ["Bateaux sans permis", "Coût d'un skipper", "Formation rapide possible ?"],
    filter: null,
  },
  {
    keywords: ["équipement", "matériel", "fourni", "inclus", "à bord"],
    response:
      "Tous nos bateaux sont équipés de gilets de sauvetage, d'une ancre, de matériel de sécurité et d'une glacière. Les plus grands modèles disposent également d'une cabine, de toilettes et parfois d'une cuisine équipée.",
    suggestions: ["Équipement de pêche", "Équipement pour enfants", "Possibilité d'apporter son matériel"],
    filter: null,
  },
  {
    keywords: ["météo", "temps", "vent", "conditions", "annulation"],
    response:
      "Nous surveillons attentivement les conditions météorologiques. En cas de mauvais temps rendant la navigation dangereuse, nous vous proposerons un report sans frais ou un remboursement intégral.",
    suggestions: ["Conditions d'annulation", "Navigation par temps couvert", "Période idéale"],
    filter: null,
  },
  {
    keywords: ["pêche", "pêcher", "poisson"],
    response:
      "Plusieurs de nos bateaux sont adaptés à la pêche, notamment nos bateaux à moteur qui permettent d'accéder facilement aux meilleurs spots. Nous pouvons vous conseiller sur les zones de pêche selon la saison.",
    suggestions: ["Location de matériel de pêche", "Meilleurs bateaux pour la pêche", "Zones recommandées"],
    filter: (boat: Boat) => boat.type.toLowerCase().includes("moteur"),
  },
  {
    keywords: ["famille", "enfant", "enfants", "sécurité"],
    response:
      "La sécurité est notre priorité, surtout pour les familles avec enfants. Tous nos bateaux sont équipés de gilets de sauvetage pour adultes et enfants. Nous recommandons les catamarans ou les bateaux à moteur stables pour les familles avec de jeunes enfants.",
    suggestions: ["Bateaux adaptés aux enfants", "Équipements de sécurité", "Âge minimum recommandé"],
    filter: (boat: Boat) => boat.type.toLowerCase().includes("catamaran") || boat.capacity >= 6,
  },
  {
    keywords: ["débutant", "première fois", "novice", "jamais", "expérience"],
    response:
      "Pour les débutants, nous recommandons nos bateaux à moteur faciles à manœuvrer ou nos voiliers avec option de skipper. Nous proposons également une initiation rapide avant le départ pour vous familiariser avec les commandes de base.",
    suggestions: ["Formation incluse ?", "Bateaux faciles à manœuvrer", "Option avec skipper"],
    filter: (boat: Boat) => boat.type.toLowerCase().includes("moteur") || boat.capacity <= 6,
  },
  {
    keywords: ["tous", "tout", "liste", "catalogue", "disponible"],
    response:
      "Voici la liste complète de nos bateaux disponibles. Vous pouvez filtrer selon vos préférences en me précisant vos critères (type de bateau, capacité, budget...).",
    suggestions: ["Trier par prix", "Trier par capacité", "Recommandations populaires"],
    filter: null,
  },
  {
    keywords: ["comparer", "comparaison", "différence", "meilleur"],
    response:
      "Pour vous aider à comparer, je peux vous présenter les différences entre nos types de bateaux. Les voiliers offrent une expérience authentique, les yachts du luxe, les catamarans de la stabilité, et les bateaux à moteur de la vitesse.",
    suggestions: ["Comparer voilier et catamaran", "Meilleur rapport qualité/prix", "Option la plus confortable"],
    filter: null,
  },
  {
    keywords: ["merci", "super", "génial", "parfait", "excellent"],
    response:
      "Je vous en prie ! C'est un plaisir de vous aider. N'hésitez pas si vous avez d'autres questions. Je vous souhaite une excellente expérience nautique !",
    suggestions: ["Comment réserver ?", "Autres services proposés", "Contacter un conseiller"],
    filter: null,
  },
]

// Fonction pour combiner plusieurs filtres
const combineFilters = (filters: Array<(boat: Boat) => boolean>) => {
  return (boat: Boat) => filters.every((filter) => filter(boat))
}

export function BoatList({ boats }: BoatListProps) {
  const [filteredBoats, setFilteredBoats] = useState<Boat[]>([])
  const [mounted, setMounted] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const [activeFilters, setActiveFilters] = useState<string[]>([])
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
        suggestions: [
          "Quels types de bateaux proposez-vous ?",
          "Je cherche un bateau pour 6 personnes",
          "Quel est le prix d'une location ?",
        ],
      },
    ])
  }, [boats])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Fonction pour trouver une réponse locale basée sur les mots-clés et le contexte
  const findLocalResponse = (input: string) => {
    const lowercaseInput = input.toLowerCase()

    // Ajouter l'entrée actuelle au contexte de la conversation
    const updatedContext = [...conversationContext, lowercaseInput]
    setConversationContext(updatedContext)

    // Créer un score pour chaque réponse possible basé sur les mots-clés et le contexte
    const scoredResponses = localResponses.map((item) => {
      let score = 0

      // Score basé sur les mots-clés dans l'entrée actuelle
      item.keywords.forEach((keyword) => {
        if (lowercaseInput.includes(keyword)) {
          score += 10 // Score élevé pour les correspondances directes
        }
      })

      // Score supplémentaire basé sur le contexte de la conversation
      updatedContext.forEach((contextItem) => {
        item.keywords.forEach((keyword) => {
          if (contextItem.includes(keyword)) {
            score += 2 // Score plus faible pour les correspondances de contexte
          }
        })
      })

      return { response: item, score }
    })

    // Trier par score et prendre la meilleure correspondance
    scoredResponses.sort((a, b) => b.score - a.score)

    // Si le meilleur score est trop bas, utiliser une réponse par défaut
    if (scoredResponses[0].score < 5) {
      return {
        response:
          "Je ne suis pas sûr de comprendre votre demande. Pouvez-vous préciser ce que vous recherchez ? Par exemple, vous pouvez me demander des informations sur les voiliers, les yachts, ou les bateaux à moteur.",
        suggestions: ["Types de bateaux disponibles", "Prix des locations", "Capacité des bateaux"],
        filter: null,
      }
    }

    return {
      response: scoredResponses[0].response.response,
      suggestions: scoredResponses[0].response.suggestions,
      filter: scoredResponses[0].response.filter,
    }
  }

  // Fonction pour analyser l'entrée et extraire des critères de filtrage multiples
  const extractFilterCriteria = (input: string) => {
    const lowercaseInput = input.toLowerCase()
    const filters: Array<(boat: Boat) => boolean> = []
    const appliedFilters: string[] = []

    // Filtrer par type de bateau
    if (lowercaseInput.includes("voilier")) {
      filters.push((boat: Boat) => boat.type.toLowerCase().includes("voilier"))
      appliedFilters.push("Voilier")
    }
    if (lowercaseInput.includes("yacht") || lowercaseInput.includes("luxe")) {
      filters.push((boat: Boat) => boat.type.toLowerCase().includes("yacht"))
      appliedFilters.push("Yacht")
    }
    if (lowercaseInput.includes("catamaran")) {
      filters.push((boat: Boat) => boat.type.toLowerCase().includes("catamaran"))
      appliedFilters.push("Catamaran")
    }
    if (lowercaseInput.includes("moteur") || lowercaseInput.includes("rapide")) {
      filters.push((boat: Boat) => boat.type.toLowerCase().includes("moteur"))
      appliedFilters.push("Bateau à moteur")
    }

    // Filtrer par capacité
    const capacityMatch = lowercaseInput.match(/(\d+)\s*personnes?/)
    if (capacityMatch) {
      const capacity = Number.parseInt(capacityMatch[1])
      filters.push((boat: Boat) => boat.capacity >= capacity)
      appliedFilters.push(`${capacity}+ personnes`)
    }

    // Filtrer par taille de groupe
    if (lowercaseInput.includes("petit") || lowercaseInput.includes("couple") || lowercaseInput.match(/\b[2-4]\b/)) {
      filters.push((boat: Boat) => boat.capacity <= 4)
      appliedFilters.push("Petits groupes")
    }
    if (
      lowercaseInput.includes("grand") ||
      lowercaseInput.includes("famille") ||
      lowercaseInput.includes("groupe") ||
      lowercaseInput.match(/\b[8-9]|1[0-2]\b/)
    ) {
      filters.push((boat: Boat) => boat.capacity >= 8)
      appliedFilters.push("Grands groupes")
    }

    // Filtrer par prix (approximatif)
    if (
      lowercaseInput.includes("économique") ||
      lowercaseInput.includes("pas cher") ||
      lowercaseInput.includes("abordable")
    ) {
      filters.push((boat: Boat) => boat.pricing.weekday["4h"] < 200)
      appliedFilters.push("Économique")
    }
    if (
      lowercaseInput.includes("luxueux") ||
      lowercaseInput.includes("premium") ||
      lowercaseInput.includes("haut de gamme")
    ) {
      filters.push((boat: Boat) => boat.pricing.weekday["4h"] >= 300)
      appliedFilters.push("Premium")
    }

    return { combinedFilter: filters.length > 0 ? combineFilters(filters) : null, appliedFilters }
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
        const { response, suggestions, filter } = findLocalResponse(userQuestion)

        // Extraire des critères de filtrage multiples
        const { combinedFilter, appliedFilters } = extractFilterCriteria(userQuestion)

        // Déterminer le filtre à utiliser (priorité au filtre extrait s'il existe)
        const finalFilter = combinedFilter || filter

        // Filtrer les bateaux si nécessaire
        let filteredResults = boats
        if (finalFilter) {
          filteredResults = boats.filter(finalFilter)
          setFilteredBoats(filteredResults)
          setActiveFilters(appliedFilters)
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
            setActiveFilters([])
          }
        }

        // Ajouter la réponse au chat
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response,
            suggestions: suggestions,
            filteredBoats: finalFilter ? filteredResults : undefined,
          },
        ])
      } catch (error) {
        console.error("Erreur lors du traitement de la demande:", error)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Désolé, une erreur est survenue lors du traitement de votre demande.",
            suggestions: ["Réessayer", "Contacter le support", "Voir tous les bateaux"],
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
    setActiveFilters([])
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "J'ai réinitialisé les filtres. Voici tous nos bateaux disponibles.",
        suggestions: [
          "Quels types de bateaux proposez-vous ?",
          "Je cherche un bateau pour 6 personnes",
          "Quel est le prix d'une location ?",
        ],
      },
    ])
  }

  const handleSuggestionClick = (suggestion: string) => {
    setChatInput(suggestion)
    handleSendMessage()
  }

  const handleFeedback = (messageIndex: number, type: "positive" | "negative") => {
    setMessages((prev) => prev.map((msg, idx) => (idx === messageIndex ? { ...msg, feedback: type } : msg)))

    // Ajouter un message de remerciement pour le feedback
    if (type === "positive") {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Merci pour votre retour positif ! Je suis heureux d'avoir pu vous aider.",
          suggestions: ["Continuer ma recherche", "Voir les détails d'un bateau", "Comment réserver ?"],
        },
      ])
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Je vous remercie pour votre retour. Je vais m'efforcer d'améliorer mes réponses. Pouvez-vous préciser votre demande différemment ?",
          suggestions: ["Voir tous les bateaux", "Parler à un conseiller", "Recommencer ma recherche"],
        },
      ])
    }
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
            <h3 className="text-sm font-medium text-ocean-dark flex items-center">
              <Ship className="h-4 w-4 mr-2 text-ocean-dark" />
              Assistant de recherche
            </h3>
            <div className="flex items-center gap-2">
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-1 mr-2">
                  {activeFilters.map((filter, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-ocean-light/10 text-ocean-dark border-ocean-light"
                    >
                      {filter}
                    </Badge>
                  ))}
                </div>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 text-xs">
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Réinitialiser les filtres</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div ref={chatContainerRef} className="h-[250px] p-3 overflow-y-auto flex flex-col gap-2">
            {messages.map((msg, index) => (
              <div key={index} className="flex flex-col">
                <div
                  className={`max-w-[80%] p-2 rounded-lg ${
                    msg.role === "user" ? "bg-ocean-light text-white self-end" : "bg-gray-100 text-gray-800 self-start"
                  }`}
                >
                  {msg.content}

                  {/* Afficher le nombre de bateaux filtrés si disponible */}
                  {msg.filteredBoats && (
                    <div className="mt-1 text-xs opacity-80">{msg.filteredBoats.length} bateau(s) trouvé(s)</div>
                  )}
                </div>

                {/* Boutons de feedback pour les messages de l'assistant */}
                {msg.role === "assistant" && !msg.feedback && (
                  <div className="self-start flex gap-1 mt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleFeedback(index, "positive")}
                    >
                      <ThumbsUp className="h-3 w-3 text-gray-500 hover:text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleFeedback(index, "negative")}
                    >
                      <ThumbsDown className="h-3 w-3 text-gray-500 hover:text-red-500" />
                    </Button>
                  </div>
                )}

                {/* Afficher le feedback s'il existe */}
                {msg.role === "assistant" && msg.feedback && (
                  <div className="self-start mt-1 text-xs text-gray-500">
                    {msg.feedback === "positive" ? "Merci pour votre retour positif!" : "Merci pour votre retour."}
                  </div>
                )}

                {/* Suggestions de questions */}
                {msg.role === "assistant" && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="self-start mt-2 flex flex-wrap gap-1">
                    {msg.suggestions.map((suggestion, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs bg-ocean-light/5 border-ocean-light/30 text-ocean-dark hover:bg-ocean-light/10"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
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

      {/* Filtres rapides */}
      <div className="mb-3 flex flex-wrap gap-2">
        <div className="text-xs text-gray-500 flex items-center mr-1">
          <Info className="h-3 w-3 mr-1" /> Filtres rapides:
        </div>
        {boatTypes.map((type, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className={`h-7 text-xs ${
              activeFilters.includes(type)
                ? "bg-ocean-light text-white border-ocean-light"
                : "bg-white text-gray-700 hover:bg-ocean-light/10"
            }`}
            onClick={() => handleSuggestionClick(`Je cherche un ${type.toLowerCase()}`)}
          >
            {type}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => handleSuggestionClick("Bateaux pour 6 personnes")}
        >
          <Users className="h-3 w-3 mr-1" /> 6+ personnes
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => handleSuggestionClick("Prix des locations")}
        >
          <CreditCard className="h-3 w-3 mr-1" /> Tarifs
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => handleSuggestionClick("Durées disponibles")}
        >
          <Clock className="h-3 w-3 mr-1" /> Durées
        </Button>
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
