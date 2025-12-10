"use client"

import { useState, useEffect } from "react"

interface LocationBlockProps {
  title: string
  url: string | null
  themeOverrides?: {
    backgroundColor: string
    textPrimary: string
    textSecondary: string
    cardBackground: string
    borderColor: string
  }
  onBlockClick?: () => void
}

// Fonction pour extraire les coordonnées ou l'adresse de l'URL
function parseLocation(url: string | null, title: string): { lat: number; lng: number; address: string } | null {
  if (!url) {
    // Si pas d'URL mais un titre, essayer de parser le titre
    const coordsInTitle = title.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/)
    if (coordsInTitle) {
      return {
        lat: parseFloat(coordsInTitle[1]),
        lng: parseFloat(coordsInTitle[2]),
        address: title,
      }
    }
    return null
  }

  // Si c'est une URL Google Maps avec coordonnées (@lat,lng)
  const googleMapsMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (googleMapsMatch) {
    return {
      lat: parseFloat(googleMapsMatch[1]),
      lng: parseFloat(googleMapsMatch[2]),
      address: title || "",
    }
  }

  // Si c'est une URL Google Maps avec query params (q=adresse ou q=lat,lng)
  const queryMatch = url.match(/[?&]q=([^&]+)/)
  if (queryMatch) {
    const query = decodeURIComponent(queryMatch[1])
    // Vérifier si c'est des coordonnées
    const coordsMatch = query.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/)
    if (coordsMatch) {
      return {
        lat: parseFloat(coordsMatch[1]),
        lng: parseFloat(coordsMatch[2]),
        address: title || query,
      }
    }
    // Sinon c'est une adresse
    return {
      lat: 0,
      lng: 0,
      address: query,
    }
  }

  // Si c'est des coordonnées directes (lat,lng)
  const coordsMatch = url.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/)
  if (coordsMatch) {
    return {
      lat: parseFloat(coordsMatch[1]),
      lng: parseFloat(coordsMatch[2]),
      address: title || url,
    }
  }

  // Si c'est une URL Google Maps standard, utiliser le titre comme adresse
  if (url.includes("maps.google.com") || url.includes("google.com/maps")) {
    return {
      lat: 0,
      lng: 0,
      address: title || "Location",
    }
  }

  return null
}

export function LocationBlock({ title, url, themeOverrides, onBlockClick }: LocationBlockProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    const parsed = parseLocation(url, title)
    if (parsed && parsed.lat !== 0 && parsed.lng !== 0) {
      setLocation(parsed)
    } else if (parsed && parsed.address) {
      // Si on a juste une adresse sans coordonnées, utiliser une location par défaut
      // L'utilisateur devra fournir des coordonnées ou une URL Google Maps complète
      setLocation({ lat: 50.5039, lng: 4.4699, address: parsed.address })
    } else {
      // Location par défaut si rien n'est fourni
      setLocation({ lat: 50.5039, lng: 4.4699, address: title || "Location" })
    }
  }, [url, title])

  if (!location) {
    return null
  }

  // URL Google Maps pour le clic
  const googleMapsUrl = url || (location.lat !== 0 && location.lng !== 0 
    ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
    : `https://www.google.com/maps?q=${encodeURIComponent(location.address)}`)
  
  // Calculer le bbox pour OpenStreetMap
  const zoom = 10
  const latOffset = 0.1
  const lngOffset = 0.15
  const bbox = `${location.lng - lngOffset},${location.lat - latOffset},${location.lng + lngOffset},${location.lat + latOffset}`

  const handleClick = () => {
    onBlockClick?.()
    window.open(googleMapsUrl, "_blank", "noopener,noreferrer")
  }

  // Utiliser une image de map statique simple (via une API gratuite)
  // Pour l'instant, on va utiliser une approche avec une div stylisée qui ressemble à une map
  const displayAddress = location.address || title || "Location"

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
      style={{
        backgroundColor: themeOverrides?.cardBackground || "#ffffff",
        borderColor: themeOverrides?.borderColor || "#e5e7eb",
        borderWidth: "1px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
      }}
      onClick={handleClick}
    >
      {/* Map Container */}
      <div className="relative w-full h-[200px] sm:h-[250px] overflow-hidden">
        {/* Map Image - Utiliser un iframe OpenStreetMap */}
        {location.lat !== 0 && location.lng !== 0 ? (
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${location.lat},${location.lng}`}
            className="w-full h-full border-0 pointer-events-none"
            style={{ filter: "grayscale(0.2) brightness(1.1) saturate(0.9)" }}
            title="Map"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "#f3f4f6" }}
          >
            <span className="text-sm text-gray-500">{location.address}</span>
          </div>
        )}
        
        {/* Pin Overlay */}
        {location.lat !== 0 && location.lng !== 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
            <div className="relative">
              {/* Ombre du pin */}
              <div className="absolute top-[20px] left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-black/15 rounded-full blur-[2px]"></div>
              {/* Pin externe (halo blanc) */}
              <div className="relative">
                <div className="w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center">
                  {/* Pin interne (bleu) */}
                  <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Location Label */}
      <div className="absolute bottom-3 left-3 z-10">
        <div
          className="px-3 py-1.5 rounded-lg shadow-sm"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            color: themeOverrides?.textPrimary || "#111111",
            backdropFilter: "blur(4px)",
          }}
        >
          <span className="text-sm font-medium">{displayAddress}</span>
        </div>
      </div>
    </div>
  )
}
