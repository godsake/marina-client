export interface Boat {
  id: string
  name: string
  type: string
  description: string
  capacity: number
  image_url: string
  secondary_image_url: string // Correction du nom de la propriété
  pricing: {
    weekday: {
      "4h": number
      "6h": number
      "8h": number
    }
    weekend: {
      "4h": number
      "6h": number
      "8h": number
    }
  }
  availability: {
    date: string
    slots: {
      start: string
      end: string
    }[]
  }[]
}
