"use client"

import { useEffect, useState } from "react"
import { Cloud, CloudRain, CloudSnow, Sun, Wind } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface WeatherForecastProps {
  date: string | null
}

interface WeatherData {
  temperature: number
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "windy"
  windSpeed: number
}

export function WeatherForecast({ date }: WeatherForecastProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!date) {
      setWeather(null)
      return
    }

    setLoading(true)

    // In a real app, you would fetch from a weather API
    // For demo purposes, we'll simulate a fetch with random weather data
    const fetchWeather = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Generate random weather data for demo
      const conditions: Array<"sunny" | "cloudy" | "rainy" | "snowy" | "windy"> = [
        "sunny",
        "cloudy",
        "rainy",
        "snowy",
        "windy",
      ]
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
      const randomTemp = Math.floor(Math.random() * 25) + 5 // 5-30°C
      const randomWind = Math.floor(Math.random() * 30) + 5 // 5-35 km/h

      setWeather({
        temperature: randomTemp,
        condition: randomCondition,
        windSpeed: randomWind,
      })
      setLoading(false)
    }

    fetchWeather()
  }, [date])

  if (!date) return null

  if (loading) {
    return (
      <Card className="mb-3 border-ocean-light">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 animate-pulse rounded bg-ocean-light/40"></div>
            <div className="h-8 w-8 animate-pulse rounded-full bg-ocean-light/40"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) return null

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500 animate-float" />
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-500 animate-float" />
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-500 animate-float" />
      case "snowy":
        return <CloudSnow className="h-6 w-6 text-blue-300 animate-float" />
      case "windy":
        return <Wind className="h-6 w-6 text-gray-500 animate-float" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  const getWeatherBackground = () => {
    switch (weather.condition) {
      case "sunny":
        return "bg-gradient-to-r from-yellow-50 to-blue-50 border-yellow-200"
      case "cloudy":
        return "bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
      case "rainy":
        return "bg-gradient-to-r from-blue-50 to-gray-50 border-blue-200"
      case "snowy":
        return "bg-gradient-to-r from-blue-50 to-gray-50 border-blue-100"
      case "windy":
        return "bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
    }
  }

  return (
    <Card className={`mb-3 overflow-hidden ${getWeatherBackground()}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-medium text-gray-700">Météo pour {formatDate(date)}</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-700">
              <span className="font-medium">{weather.temperature}°C</span>
              <span>•</span>
              <span>Vent: {weather.windSpeed} km/h</span>
            </div>
          </div>
          <div className="bg-white/70 p-2 rounded-full shadow-sm">{getWeatherIcon()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
