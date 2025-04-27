import type { Boat } from "@/types/boat"

// Function to fetch boats from the API
export async function getBoats(): Promise<Boat[]> {
  try {
    // Utilisation de next: { revalidate: 3600 } au lieu de cache: "no-store"
    // pour permettre le rendu statique avec revalidation toutes les heures
    const response = await fetch("https://n8n.srv798586.hstgr.cloud/webhook/get-boats", {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error(`Error fetching boats: ${response.status}`)
    }

    const boats: Boat[] = await response.json()
    return boats
  } catch (error) {
    console.error("Failed to fetch boats:", error)
    return [] // Return empty array in case of error
  }
}

// Fallback data in case the API is unavailable
export const fallbackBoats: Boat[] = [
  {
    id: "boat1",
    name: "Chaloupe",
    type: "Voilier",
    description:
      "Notre chaloupe de 14 pieds de long en fibre de verre comporte un moteur de 15 HP. Elle peut accueillir jusqu'à 450 lbs ou 3 adultes avec de l'équipement de pêche. Vous serez installés confortablement grâce aux deux sièges rembourrés et aux porte-canne à pêche et vous serez en sécurité grâce à l'équipement fourni (veste de sauvetage, trousse de premiers soins, etc.).",
    capacity: 3,
    image_url:
      "https://static.wixstatic.com/media/915cf6_2efa37e93de74e9e96641a143ccc915e~mv2.jpg/v1/fill/w_380,h_285,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/915cf6_2efa37e93de74e9e96641a143ccc915e~mv2.jpg",
    secondary_image_url:
      "https://images.pexels.com/photos/1044990/pexels-photo-1044990.jpeg?auto=compress&cs=tinysrgb&w=300&h=200",
    pricing: {
      weekday: {
        "4h": 150,
        "6h": 200,
        "8h": 250,
      },
      weekend: {
        "4h": 180,
        "6h": 240,
        "8h": 300,
      },
    },
    availability: [
      {
        date: "2025-04-26",
        slots: [
          { start: "09:00", end: "17:00" },
          { start: "18:00", end: "21:00" },
        ],
      },
      {
        date: "2025-04-27",
        slots: [{ start: "09:00", end: "17:00" }],
      },
    ],
  },
  // Add more fallback boats if needed
]
