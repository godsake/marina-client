"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { WeatherForecast } from "@/components/weather-forecast"
import { Anchor, Calendar, Clock, Loader2, AlertCircle } from "lucide-react"
import type { Boat } from "@/types/boat"

interface BookingFormProps {
  boat: Boat
}

interface TimeSlot {
  start: string
  end: string
  display: string
}

interface MonthOption {
  value: string
  label: string
  year: number
  month: number
}

export function BookingForm({ boat }: BookingFormProps) {
  const router = useRouter()
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedDuration, setSelectedDuration] = useState<"4h" | "6h" | "8h">("4h")
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showTimeSlotError, setShowTimeSlotError] = useState(false)
  const [availableMonths, setAvailableMonths] = useState<MonthOption[]>([])
  const [availableDatesForMonth, setAvailableDatesForMonth] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  // Set mounted state on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get available dates and organize them by month
  useEffect(() => {
    if (!mounted) return

    const dates = boat.availability.map((a) => a.date)
    const monthsMap = new Map<string, { year: number; month: number; dates: string[] }>()

    dates.forEach((dateStr) => {
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const month = date.getMonth()
      const key = `${year}-${month.toString().padStart(2, "0")}`

      if (!monthsMap.has(key)) {
        monthsMap.set(key, {
          year,
          month,
          dates: [dateStr],
        })
      } else {
        monthsMap.get(key)?.dates.push(dateStr)
      }
    })

    const monthOptions: MonthOption[] = Array.from(monthsMap.entries())
      .map(([value, data]) => {
        const date = new Date(data.year, data.month, 1)
        const label = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
        return {
          value,
          label,
          year: data.year,
          month: data.month,
        }
      })
      .sort((a, b) => {
        // Sort by year and month
        if (a.year !== b.year) return a.year - b.year
        return a.month - b.month
      })

    setAvailableMonths(monthOptions)
  }, [boat.availability, mounted])

  // Update available dates when month changes
  useEffect(() => {
    if (!mounted || !selectedMonth) {
      setAvailableDatesForMonth([])
      setSelectedDate("")
      return
    }

    const [year, month] = selectedMonth.split("-").map(Number)
    const datesInSelectedMonth = boat.availability
      .map((a) => a.date)
      .filter((dateStr) => {
        const date = new Date(dateStr)
        return date.getFullYear() === year && date.getMonth() === month
      })
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

    setAvailableDatesForMonth(datesInSelectedMonth)
    setSelectedDate("")
  }, [selectedMonth, boat.availability, mounted])

  // Determine if it's a weekend
  const isWeekend = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDay()
    return day === 0 || day === 6 // 0 is Sunday, 6 is Saturday
  }

  // Calculate price
  const calculatePrice = () => {
    if (!selectedDate || !selectedDuration) return 0

    const pricingType = isWeekend(selectedDate) ? "weekend" : "weekday"
    return boat.pricing[pricingType][selectedDuration as keyof typeof boat.pricing.weekday]
  }

  // Generate time slots based on date and duration
  const generateTimeSlots = (date: string, duration: "4h" | "6h" | "8h") => {
    if (!date) {
      setAvailableTimeSlots([])
      return
    }

    const availabilityForDate = boat.availability.find((a) => a.date === date)
    if (!availabilityForDate) {
      setAvailableTimeSlots([])
      return
    }

    const slots: TimeSlot[] = []
    const durationHours = Number.parseInt(duration.replace("h", ""))

    availabilityForDate.slots.forEach((slot) => {
      const startTime = slot.start
      const endTime = slot.end

      // Parse hours
      const startHour = Number.parseInt(startTime.split(":")[0])
      const startMinute = Number.parseInt(startTime.split(":")[1])
      const endHour = Number.parseInt(endTime.split(":")[0])
      const endMinute = Number.parseInt(endTime.split(":")[1])

      // Calculate total minutes
      const startTotalMinutes = startHour * 60 + startMinute
      const endTotalMinutes = endHour * 60 + endMinute
      const totalAvailableMinutes = endTotalMinutes - startTotalMinutes

      // Convert duration to minutes
      const durationMinutes = durationHours * 60

      if (totalAvailableMinutes < durationMinutes) {
        return // Skip if slot is too short for selected duration
      }

      // Generate slots based on duration
      let intervalMinutes = 60 // Default for 4h
      if (duration === "6h") intervalMinutes = 120 // 2 hour intervals for 6h
      if (duration === "8h") intervalMinutes = totalAvailableMinutes // Just one slot for 8h

      for (let i = startTotalMinutes; i <= endTotalMinutes - durationMinutes; i += intervalMinutes) {
        const slotStartHour = Math.floor(i / 60)
        const slotStartMinute = i % 60
        const slotEndHour = Math.floor((i + durationMinutes) / 60)
        const slotEndMinute = (i + durationMinutes) % 60

        const slotStart = `${slotStartHour.toString().padStart(2, "0")}:${slotStartMinute.toString().padStart(2, "0")}`
        const slotEnd = `${slotEndHour.toString().padStart(2, "0")}:${slotEndMinute.toString().padStart(2, "0")}`

        slots.push({
          start: slotStart,
          end: slotEnd,
          display: `${slotStart} - ${slotEnd}`,
        })
      }
    })

    setAvailableTimeSlots(slots)
    setSelectedTimeSlot(null) // Reset selected slot when generating new slots
    setShowTimeSlotError(false) // Reset error when generating new slots
  }

  // Update time slots when date or duration changes
  useEffect(() => {
    if (!mounted) return
    generateTimeSlots(selectedDate, selectedDuration)
  }, [selectedDate, selectedDuration, mounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!selectedTimeSlot) {
      setShowTimeSlotError(true)
      return
    }

    try {
      setIsSubmitting(true)

      // Prepare booking data
      const bookingData = {
        boat_id: boat.id,
        boat_name: boat.name,
        date: selectedDate,
        start_time: selectedTimeSlot.start,
        end_time: selectedTimeSlot.end,
        duration: selectedDuration,
        price: calculatePrice(),
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      }

      // Send booking data to the API
      const response = await fetch("https://n8n.srv798586.hstgr.cloud/webhook/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de la réservation: ${response.status}`)
      }

      // Handle successful booking
      alert(
        `Réservation soumise avec succès pour ${selectedDate} de ${selectedTimeSlot.start} à ${selectedTimeSlot.end}! Un email de confirmation vous sera envoyé.`,
      )

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Erreur lors de la réservation:", error)
      setSubmitError("Une erreur est survenue lors de la réservation. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  // Required field indicator component
  const RequiredIndicator = () => (
    <span className="text-red-500 ml-1" aria-hidden="true">
      *
    </span>
  )

  // Simple version for server-side rendering
  if (!mounted) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-full bg-gray-200 rounded"></div>
        <div className="h-32 w-full bg-gray-200 rounded"></div>
        <div className="h-8 w-full bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* Month Selection */}
        <div className="relative">
          <Label htmlFor="month" className="text-xs flex items-center text-gray-700 font-medium">
            <Calendar className="mr-1 h-3 w-3 text-ocean-dark" />
            Mois
            <RequiredIndicator />
          </Label>
          <Select value={selectedMonth} onValueChange={(value) => setSelectedMonth(value)}>
            <SelectTrigger id="month" className="h-9 text-xs border-ocean-light focus:ring-ocean-dark">
              <SelectValue placeholder="Sélectionnez un mois" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((month) => (
                <SelectItem key={month.value} value={month.value} className="text-xs">
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Selection - Only shown after month is selected */}
        {selectedMonth && (
          <div className="relative animate-in fade-in-50 duration-300">
            <Label htmlFor="date" className="text-xs flex items-center text-gray-700 font-medium">
              <Calendar className="mr-1 h-3 w-3 text-ocean-dark" />
              Date
              <RequiredIndicator />
            </Label>
            <Select value={selectedDate} onValueChange={(value) => setSelectedDate(value)}>
              <SelectTrigger id="date" className="h-9 text-xs border-ocean-light focus:ring-ocean-dark">
                <SelectValue placeholder="Sélectionnez une date" />
              </SelectTrigger>
              <SelectContent>
                {availableDatesForMonth.map((date) => (
                  <SelectItem key={date} value={date} className="text-xs">
                    {formatDate(date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedDate && <WeatherForecast date={selectedDate} />}

        {selectedDate && (
          <div className="relative animate-in fade-in-50 duration-300">
            <Label htmlFor="duration" className="text-xs flex items-center text-gray-700 font-medium">
              <Clock className="mr-1 h-3 w-3 text-ocean-dark" />
              Durée
              <RequiredIndicator />
            </Label>
            <Select
              value={selectedDuration}
              onValueChange={(value) => setSelectedDuration(value as "4h" | "6h" | "8h")}
            >
              <SelectTrigger id="duration" className="h-9 text-xs border-ocean-light focus:ring-ocean-dark">
                <SelectValue placeholder="Sélectionnez une durée" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4h" className="text-xs">
                  4 heures
                </SelectItem>
                <SelectItem value="6h" className="text-xs">
                  6 heures
                </SelectItem>
                <SelectItem value="8h" className="text-xs">
                  8 heures
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedDate && selectedDuration && (
          <div className="bg-ocean-light/10 p-3 rounded-lg border border-ocean-light animate-in fade-in-50 duration-300">
            <Label className="text-xs mb-2 block text-gray-700 font-medium flex items-center">
              <Anchor className="mr-1 h-3 w-3 text-ocean-dark" />
              Créneaux disponibles
              <RequiredIndicator />
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {availableTimeSlots.length > 0 ? (
                availableTimeSlots.map((slot, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={selectedTimeSlot === slot ? "default" : "outline"}
                    className={`h-9 text-xs transition-all ${
                      selectedTimeSlot === slot
                        ? "bg-ocean-dark hover:bg-ocean-dark/90 text-white"
                        : "border-ocean-light hover:border-ocean-dark hover:bg-ocean-light/10 text-gray-700"
                    }`}
                    onClick={() => {
                      setSelectedTimeSlot(slot)
                      setShowTimeSlotError(false)
                    }}
                  >
                    {slot.display}
                  </Button>
                ))
              ) : (
                <p className="col-span-2 text-xs text-gray-700 bg-white p-2 rounded">
                  Aucun créneau disponible pour cette durée. Veuillez sélectionner une autre date ou durée.
                </p>
              )}
            </div>
            {showTimeSlotError && availableTimeSlots.length > 0 && !selectedTimeSlot && (
              <div className="mt-2 flex items-center text-red-500 text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                Veuillez sélectionner un créneau horaire
              </div>
            )}
          </div>
        )}

        {selectedTimeSlot && (
          <div className="space-y-3 animate-in fade-in-50 duration-300 bg-white p-3 rounded-lg border border-ocean-light">
            <div>
              <Label htmlFor="name" className="text-xs text-gray-700 font-medium flex items-center">
                Nom
                <RequiredIndicator />
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-9 text-xs border-ocean-light focus:ring-ocean-dark"
                aria-required="true"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-xs text-gray-700 font-medium flex items-center">
                Email
                <RequiredIndicator />
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-9 text-xs border-ocean-light focus:ring-ocean-dark"
                aria-required="true"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-xs text-gray-700 font-medium flex items-center">
                Téléphone
                <RequiredIndicator />
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="h-9 text-xs border-ocean-light focus:ring-ocean-dark"
                aria-required="true"
              />
            </div>

            <div className="text-xs text-gray-500 mt-1">
              <span className="text-red-500">*</span> Champs obligatoires
            </div>
          </div>
        )}
      </div>

      {selectedTimeSlot && (
        <div className="rounded-lg bg-ocean-light/10 p-3 border border-ocean-light">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-gray-700">Prix total</h3>
              <p className="text-[10px] text-gray-600">
                {selectedDate && isWeekend(selectedDate) ? "Tarif weekend" : "Tarif semaine"}
              </p>
            </div>
            <div className="text-base font-bold text-ocean-dark">{formatCurrency(calculatePrice())}</div>
          </div>
        </div>
      )}

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded-md text-xs">{submitError}</div>
      )}

      <Button
        type="submit"
        className="w-full h-10 text-sm bg-ocean-dark hover:bg-ocean-dark/90 text-white transition-all shadow-md hover:shadow-lg"
        disabled={!selectedDate || !selectedDuration || isSubmitting || !selectedTimeSlot}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <Anchor className="mr-2 h-4 w-4" />
            Réserver maintenant
          </>
        )}
      </Button>
    </form>
  )
}
