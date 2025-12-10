"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin } from "lucide-react"

interface LocationPickerProps {
  initialUrl?: string | null
  initialTitle?: string
  onLocationChange: (url: string, title: string) => void
}

interface LocationResult {
  lat: number
  lon: number
  display_name: string
}

export function LocationPicker({ initialUrl, initialTitle, onLocationChange }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<LocationResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([50.5039, 4.4699]) // Belgique par défaut
  const [mapZoom, setMapZoom] = useState(10)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Parser l'URL initiale pour récupérer la localisation
  useEffect(() => {
    if (initialUrl) {
      const parsed = parseLocationFromUrl(initialUrl)
      if (parsed) {
        setSelectedLocation(parsed)
        setMapCenter([parsed.lat, parsed.lng])
        setMapZoom(12)
        setSearchQuery(parsed.address || initialTitle || "")
      }
    } else if (initialTitle) {
      setSearchQuery(initialTitle)
    }
  }, [initialUrl, initialTitle])

  function parseLocationFromUrl(url: string): { lat: number; lng: number; address: string } | null {
    // URL Google Maps avec coordonnées (@lat,lng)
    const googleMapsMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    if (googleMapsMatch) {
      return {
        lat: parseFloat(googleMapsMatch[1]),
        lng: parseFloat(googleMapsMatch[2]),
        address: "",
      }
    }

    // Coordonnées directes (lat,lng)
    const coordsMatch = url.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/)
    if (coordsMatch) {
      return {
        lat: parseFloat(coordsMatch[1]),
        lng: parseFloat(coordsMatch[2]),
        address: "",
      }
    }

    // URL Google Maps avec query params
    const queryMatch = url.match(/[?&]q=([^&]+)/)
    if (queryMatch) {
      const query = decodeURIComponent(queryMatch[1])
      const coordsInQuery = query.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/)
      if (coordsInQuery) {
        return {
          lat: parseFloat(coordsInQuery[1]),
          lng: parseFloat(coordsInQuery[2]),
          address: "",
        }
      }
    }

    return null
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`,
        {
          headers: {
            "User-Agent": "korli-location-picker",
          },
        }
      )

      if (!response.ok) {
        throw new Error("Erreur de recherche")
      }

      const data = await response.json()
      setSearchResults(
        data.map((item: any) => ({
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          display_name: item.display_name,
        }))
      )
    } catch (error) {
      console.error("Erreur de recherche:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectResult = (result: LocationResult) => {
    const location = {
      lat: result.lat,
      lng: result.lon,
      address: result.display_name,
    }
    setSelectedLocation(location)
    setMapCenter([result.lat, result.lon])
    setMapZoom(14)
    setSearchQuery(result.display_name)
    setSearchResults([])

    // Générer l'URL Google Maps
    const googleMapsUrl = `https://www.google.com/maps?q=${result.lat},${result.lon}`
    onLocationChange(googleMapsUrl, result.display_name.split(",")[0] || result.display_name)
  }

  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return

    const rect = mapContainerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Convertir les coordonnées de la carte en coordonnées géographiques
    // Approximation basée sur la projection Mercator
    const latOffset = ((y - rect.height / 2) / rect.height) * (0.1 * (15 - mapZoom))
    const lngOffset = ((x - rect.width / 2) / rect.width) * (0.15 * (15 - mapZoom))

    const newLat = mapCenter[0] - latOffset
    const newLng = mapCenter[1] + lngOffset

    // Récupérer l'adresse via reverse geocoding
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "korli-location-picker",
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        const address = data.display_name || `${newLat.toFixed(6)}, ${newLng.toFixed(6)}`
        
        const location = {
          lat: newLat,
          lng: newLng,
          address,
        }

        setSelectedLocation(location)
        setMapCenter([newLat, newLng])
        setSearchQuery(address)

        // Générer l'URL Google Maps
        const googleMapsUrl = `https://www.google.com/maps?q=${newLat},${newLng}`
        const shortAddress = address.split(",")[0] || address
        onLocationChange(googleMapsUrl, shortAddress)
      } else {
        // Si le reverse geocoding échoue, utiliser juste les coordonnées
        const location = {
          lat: newLat,
          lng: newLng,
          address: `${newLat.toFixed(6)}, ${newLng.toFixed(6)}`,
        }

        setSelectedLocation(location)
        setMapCenter([newLat, newLng])

        const googleMapsUrl = `https://www.google.com/maps?q=${newLat},${newLng}`
        onLocationChange(googleMapsUrl, location.address)
      }
    } catch (error) {
      console.error("Erreur reverse geocoding:", error)
      // En cas d'erreur, utiliser juste les coordonnées
      const location = {
        lat: newLat,
        lng: newLng,
        address: `${newLat.toFixed(6)}, ${newLng.toFixed(6)}`,
      }

      setSelectedLocation(location)
      setMapCenter([newLat, newLng])

      const googleMapsUrl = `https://www.google.com/maps?q=${newLat},${newLng}`
      onLocationChange(googleMapsUrl, location.address)
    }
  }

  return (
    <div className="space-y-4">
      {/* Recherche */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Rechercher une adresse
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSearch()
                }
              }}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-zinc-300 bg-white text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              placeholder="Paris, France ou 48.8566,2.3522"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2 rounded-md bg-black text-white text-sm font-medium transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {isSearching ? "..." : "Rechercher"}
          </button>
        </div>

        {/* Résultats de recherche */}
        {searchResults.length > 0 && (
          <div className="mt-2 rounded-md border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 max-h-48 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectResult(result)}
                className="w-full px-3 py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors border-b border-zinc-100 dark:border-zinc-700 last:border-b-0"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-black dark:text-white">{result.display_name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Carte interactive */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Cliquez sur la carte pour choisir la localisation
        </label>
        <div
          ref={mapContainerRef}
          className="relative w-full h-64 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 cursor-crosshair"
        >
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter[1] - 0.1},${mapCenter[0] - 0.05},${mapCenter[1] + 0.1},${mapCenter[0] + 0.05}&layer=mapnik&marker=${mapCenter[0]},${mapCenter[1]}`}
            className="w-full h-full border-0 pointer-events-none"
            title="Map"
          />
          
          {/* Overlay cliquable transparent */}
          <div
            className="absolute inset-0 z-10"
            onClick={handleMapClick}
          />

          {/* Pin overlay */}
          {selectedLocation && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
              <div className="relative">
                <div className="absolute top-[18px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/20 rounded-full blur-sm"></div>
                <div className="w-6 h-6 bg-blue-500 rounded-full border-3 border-white shadow-lg"></div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="absolute bottom-2 left-2 right-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-zinc-600 dark:text-zinc-400 text-center pointer-events-none z-20">
            Cliquez sur la carte pour placer le marqueur
          </div>
        </div>
      </div>

      {/* Coordonnées sélectionnées */}
      {selectedLocation && (
        <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3">
          <p className="text-sm font-medium text-green-800 dark:text-green-400 mb-1">
            Localisation sélectionnée
          </p>
          <p className="text-xs text-green-700 dark:text-green-300">
            {selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Coordonnées: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  )
}
