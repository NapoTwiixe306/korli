"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { PagePreview } from "./components/page-preview"
import { AvatarUpload } from "./components/avatar-upload"
import { LayoutSelector } from "./components/layout-selector"
import { AnimationsSelector } from "./components/animations-selector"
import type { LayoutType } from "@/lib/layouts"
import type { AnimationLevel } from "@/lib/animations"

interface Block {
  id: string
  title: string
  url: string | null
  icon: string | null
  order: number
  isActive: boolean
}

interface AppearancePageClientProps {
  initialTheme: string
  initialLayout: string
  initialAnimations: AnimationLevel
  initialBio: string | null
  userName: string
  username: string
  avatar: string | null
  userImage: string | null
  blocks: Block[]
}

export function AppearancePageClient({
  initialTheme,
  initialLayout,
  initialAnimations,
  initialBio,
  userName,
  username,
  avatar,
  userImage,
  blocks,
}: AppearancePageClientProps) {
  const [theme, setTheme] = useState(initialTheme)
  const [layout, setLayout] = useState<LayoutType>(initialLayout as LayoutType)
  const [animations, setAnimations] = useState<AnimationLevel>(initialAnimations)
  const [bio, setBio] = useState(initialBio || "")
  const [currentAvatar, setCurrentAvatar] = useState(avatar)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme)
    setSaving(true)
    try {
      const response = await fetch("/api/user-page/update-theme", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme: newTheme }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } catch (error) {
      alert("Erreur lors de la sauvegarde du thème")
      setTheme(initialTheme) // Revert on error
    } finally {
      setSaving(false)
    }
  }

  const handleLayoutChange = async (newLayout: LayoutType) => {
    setLayout(newLayout)
    setSaving(true)
    try {
      const response = await fetch("/api/user-page/update-layout", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ layout: newLayout }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } catch (error) {
      alert("Erreur lors de la sauvegarde du layout")
      setLayout(initialLayout as LayoutType) // Revert on error
    } finally {
      setSaving(false)
    }
  }

  const handleAnimationsChange = async (newAnimations: AnimationLevel) => {
    setAnimations(newAnimations)
    setSaving(true)
    try {
      const response = await fetch("/api/user-page/update-animations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animations: newAnimations }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } catch (error) {
      alert("Erreur lors de la sauvegarde des animations")
      setAnimations(initialAnimations) // Revert on error
    } finally {
      setSaving(false)
    }
  }

  const handleBioSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/user-page/update-bio", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } catch (error) {
      alert("Erreur lors de la sauvegarde de la bio")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Apparence
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Personnalisez le design de votre page
            </p>
          </div>
          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Check className="h-4 w-4" />
              Enregistré
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Layout Selection */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Disposition
              </h2>
              <LayoutSelector
                currentLayout={layout}
                onLayoutChange={handleLayoutChange}
                saving={saving}
              />
            </div>

            {/* Animations Selection */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Animations
              </h2>
              <AnimationsSelector
                currentAnimations={animations}
                onAnimationsChange={handleAnimationsChange}
                saving={saving}
              />
            </div>

            {/* Theme Selection */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Thème
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {["default", "minimal", "dark", "colorful"].map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => handleThemeChange(themeOption)}
                    disabled={saving}
                    className={`rounded-lg border-2 p-4 text-left transition-colors ${
                      theme === themeOption
                        ? "border-black dark:border-white"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                    } disabled:opacity-50`}
                  >
                    <div className="font-medium text-black dark:text-white capitalize">
                      {themeOption}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Avatar
              </h2>
              <AvatarUpload
                currentAvatar={currentAvatar}
                currentUserImage={userImage}
                onAvatarChange={(newAvatar) => {
                  setCurrentAvatar(newAvatar)
                  router.refresh()
                }}
              />
            </div>

            {/* Bio */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Bio
              </h2>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                placeholder="Décrivez-vous en quelques mots..."
              />
              <button
                onClick={handleBioSave}
                disabled={saving || bio === (initialBio || "")}
                className="mt-3 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                {saving ? "Enregistrement..." : "Enregistrer la bio"}
              </button>
            </div>

            {/* Colors */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Couleurs
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Fonctionnalité à venir
              </p>
            </div>

            {/* Fonts */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Polices
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Fonctionnalité à venir
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Aperçu
              </h2>
              <PagePreview
                userName={userName}
                username={username}
                avatar={currentAvatar}
                userImage={userImage}
                bio={bio}
                blocks={blocks}
                theme={theme}
                layout={layout}
                animations={animations}
              />
              <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                Aperçu de votre page
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

