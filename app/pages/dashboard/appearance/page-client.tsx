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
  type?: string | null
  order: number
  isActive: boolean
}

interface AppearancePageClientProps {
  initialTheme: string
  initialLayout: string
  initialAnimations: AnimationLevel
  initialSocialHeaderEnabled?: boolean
  initialSocialHeaderBlockIds?: string[]
  initialThemeConfig?: Record<string, unknown> | null
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
  initialSocialHeaderEnabled = false,
  initialSocialHeaderBlockIds = [],
  initialThemeConfig = null,
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
  const [socialHeaderEnabled, setSocialHeaderEnabled] = useState(initialSocialHeaderEnabled)
  const [socialHeaderBlockIds, setSocialHeaderBlockIds] = useState<string[]>(initialSocialHeaderBlockIds || [])
  const [themeConfig, setThemeConfig] = useState<Record<string, unknown>>(
    initialThemeConfig || {
      backgroundColor: "#ffffff",
      textPrimary: "#111111",
      textSecondary: "#4b5563",
      cardBackground: "#ffffff",
      borderColor: "#e5e7eb",
      iconBackground: "#ffffff",
      iconHoverBackground: "#f1f5f9",
      usernameColor: "#111111",
      iconRadius: 9999,
    }
  )

  const themePresets: Record<string, Record<string, unknown>> = {
    clair: {
      backgroundColor: "#ffffff",
      textPrimary: "#0f172a",
      textSecondary: "#475569",
      cardBackground: "#ffffff",
      borderColor: "#e5e7eb",
      iconBackground: "#ffffff",
      iconHoverBackground: "#e2e8f0",
      usernameColor: "#0f172a",
      iconRadius: 9999,
    },
    sombre: {
      backgroundColor: "#0b1220",
      textPrimary: "#f8fafc",
      textSecondary: "#cbd5e1",
      cardBackground: "#0f172a",
      borderColor: "#1e293b",
      iconBackground: "#111827",
      iconHoverBackground: "#1f2937",
      usernameColor: "#f8fafc",
      iconRadius: 14,
    },
    coloré: {
      backgroundColor: "#0f172a",
      textPrimary: "#e2e8f0",
      textSecondary: "#cbd5e1",
      cardBackground: "#111827",
      borderColor: "#3b82f6",
      iconBackground: "#3b82f6",
      iconHoverBackground: "#2563eb",
      usernameColor: "#e2e8f0",
      iconRadius: 18,
    },
  }
  const [currentAvatar, setCurrentAvatar] = useState(avatar)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<"general" | "social" | "theme">("general")
  const [previewTheme, setPreviewTheme] = useState(initialTheme)
  const [previewLayout, setPreviewLayout] = useState<LayoutType>(initialLayout as LayoutType)
  const [previewAnimations, setPreviewAnimations] = useState<AnimationLevel>(initialAnimations)
  const [previewBio, setPreviewBio] = useState(initialBio || "")
  const [previewAvatar, setPreviewAvatar] = useState(avatar)
  const [previewSocialEnabled, setPreviewSocialEnabled] = useState(initialSocialHeaderEnabled)
  const [previewSocialIds, setPreviewSocialIds] = useState<string[]>(initialSocialHeaderBlockIds || [])
  const [previewThemeConfig, setPreviewThemeConfig] = useState<Record<string, unknown>>(themeConfig)
  const router = useRouter()

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme)
    setPreviewTheme(newTheme)
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
    setPreviewLayout(newLayout)
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
    setPreviewAnimations(newAnimations)
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
    setPreviewBio(bio)
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

  const handleSocialHeaderSave = async () => {
    setPreviewSocialEnabled(socialHeaderEnabled)
    setPreviewSocialIds(socialHeaderBlockIds)
    setSaving(true)
    try {
      const response = await fetch("/api/user-page/update-appearance", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socialHeaderEnabled,
          socialHeaderBlockIds,
        }),
      })
      if (!response.ok) throw new Error("Erreur lors de la sauvegarde")
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } catch (error) {
      alert("Erreur lors de la sauvegarde des réseaux")
    } finally {
      setSaving(false)
    }
  }

  const handleThemeConfigSave = async () => {
    setPreviewThemeConfig(themeConfig)
    setSaving(true)
    try {
      const response = await fetch("/api/user-page/update-appearance", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          themeConfig,
        }),
      })
      if (!response.ok) throw new Error("Erreur lors de la sauvegarde")
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } catch (error) {
      alert("Erreur lors de la sauvegarde du thème avancé")
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
            <div className="flex flex-wrap gap-2 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
              {[
                { key: "general", label: "Général" },
                { key: "social", label: "Réseaux" },
                { key: "theme", label: "Thème" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    activeTab === tab.key
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "social" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-black dark:text-white">Réseaux sous le nom</h2>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Choisissez d’afficher certaines icônes (blocs avec icône) sous votre nom.
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2">
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">Afficher</span>
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={socialHeaderEnabled}
                        onChange={(e) => setSocialHeaderEnabled(e.target.checked)}
                      />
                    </label>
                  </div>

                  {socialHeaderEnabled && (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">Sélectionnez les blocs à afficher (max 5 recommandés) :</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {blocks
                          .filter((b) => b.icon && b.icon.startsWith("icon:") && b.url)
                          .map((b) => {
                            const checked = socialHeaderBlockIds.includes(b.id)
                            return (
                              <label
                                key={b.id}
                                className={`flex items-center gap-3 rounded-md border p-3 text-sm transition ${
                                  checked
                                    ? "border-black dark:border-white"
                                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSocialHeaderBlockIds([...socialHeaderBlockIds, b.id])
                                    } else {
                                      setSocialHeaderBlockIds(socialHeaderBlockIds.filter((id) => id !== b.id))
                                    }
                                  }}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium text-black dark:text-white">{b.title}</span>
                                  <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{b.url}</span>
                                </div>
                              </label>
                            )
                          })}
                      </div>
                      <button
                        onClick={handleSocialHeaderSave}
                        disabled={saving}
                        className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                      >
                        Enregistrer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "general" && (
              <div className="space-y-4 sm:space-y-6">
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

                <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                    Avatar
                  </h2>
                  <AvatarUpload
                    currentAvatar={currentAvatar}
                    currentUserImage={userImage}
                    onAvatarChange={(newAvatar) => {
                      setCurrentAvatar(newAvatar)
                      setPreviewAvatar(newAvatar)
                      router.refresh()
                    }}
                  />
                </div>

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
                    onBlur={() => setPreviewBio(bio)}
                  />
                  <button
                    onClick={handleBioSave}
                    disabled={saving || bio === (initialBio || "")}
                    className="mt-3 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    {saving ? "Enregistrement..." : "Enregistrer la bio"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "theme" && (
              <div className="space-y-4 sm:space-y-6">
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

                <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="mb-1 text-lg font-semibold text-black dark:text-white">
                        Thème avancé (couleurs / arrondis)
                      </h2>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Choisissez un preset, ajustez ensuite les couleurs clés et le radius.
                      </p>
                    </div>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {Object.entries(themePresets).map(([key, preset]) => (
                      <button
                        key={key}
                        onClick={() => setThemeConfig(preset)}
                        className="rounded-md border border-zinc-200 px-3 py-1 text-sm text-black hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
                      >
                        Préset {key}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setThemeConfig({
                          backgroundColor: "#ffffff",
                          textPrimary: "#111111",
                          textSecondary: "#4b5563",
                          cardBackground: "#ffffff",
                          borderColor: "#e5e7eb",
                          iconBackground: "#ffffff",
                          iconHoverBackground: "#f1f5f9",
                          usernameColor: "#111111",
                          iconRadius: 9999,
                        })
                      }
                      className="rounded-md border border-zinc-200 px-3 py-1 text-sm text-black hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
                    >
                      Réinitialiser
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                      { key: "backgroundColor", label: "Fond de page" },
                      { key: "textPrimary", label: "Texte principal" },
                      { key: "textSecondary", label: "Texte secondaire" },
                      { key: "cardBackground", label: "Fond des cartes" },
                      { key: "borderColor", label: "Couleur des bordures" },
                      { key: "iconBackground", label: "Fond icônes header" },
                      { key: "iconHoverBackground", label: "Fond icônes (hover)" },
                      { key: "usernameColor", label: "Couleur du nom" },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between gap-3 text-sm text-black dark:text-white">
                        <span>{item.label}</span>
                        <input
                          type="color"
                          value={(themeConfig[item.key] as string) || "#ffffff"}
                          onChange={(e) =>
                            setThemeConfig({
                              ...themeConfig,
                              [item.key]: e.target.value,
                            })
                          }
                          className="h-9 w-16 cursor-pointer rounded border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
                        />
                      </label>
                    ))}
                    <label className="flex items-center justify-between gap-3 text-sm text-black dark:text-white">
                      <span>Radius icônes</span>
                      <input
                        type="number"
                        min={0}
                        max={9999}
                        value={(themeConfig.iconRadius as number) ?? 9999}
                        onChange={(e) =>
                          setThemeConfig({
                            ...themeConfig,
                            iconRadius: Number(e.target.value),
                          })
                        }
                        className="w-24 rounded border border-zinc-200 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                      />
                    </label>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleThemeConfigSave}
                      disabled={saving}
                      className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Aperçu
              </h2>
              <PagePreview
                userName={userName}
                username={username}
                avatar={previewAvatar}
                userImage={userImage}
                bio={previewBio}
                blocks={blocks
                  .map((b) => ({
                    ...b,
                    isHidden:
                      previewSocialEnabled &&
                      previewSocialIds.includes(b.id) &&
                      b.icon?.startsWith("icon:"),
                  }))
                  .filter((b) => !b.isHidden)}
                theme={previewTheme}
                layout={previewLayout}
                animations={previewAnimations}
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

