"use client"

import { useState, useRef } from "react"
import { Upload, X, Check, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface AvatarUploadProps {
  currentAvatar: string | null
  currentUserImage: string | null
  onAvatarChange: (avatarUrl: string | null) => void
}

export function AvatarUpload({
  currentAvatar,
  currentUserImage,
  onAvatarChange,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar || "")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayAvatar = currentAvatar || currentUserImage

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user-page/update-avatar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: avatarUrl || null }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      onAvatarChange(avatarUrl || null)
    } catch (error) {
      alert("Erreur lors de la sauvegarde de l'avatar")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/user-page/upload-avatar", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de l'upload")
      }

      const data = await response.json()
      setAvatarUrl(data.avatarUrl)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      onAvatarChange(data.avatarUrl)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur lors de l'upload de l'avatar")
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user-page/update-avatar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: null }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      setAvatarUrl("")
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      onAvatarChange(null)
    } catch (error) {
      alert("Erreur lors de la suppression de l'avatar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Avatar Preview */}
      {displayAvatar && (
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-zinc-200 dark:border-zinc-800">
            <Image
              src={displayAvatar}
              alt="Avatar actuel"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-black dark:text-white">
              Avatar actuel
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              {currentAvatar ? "Avatar personnalisé" : "Avatar du profil"}
            </p>
          </div>
          {currentAvatar && (
            <button
              onClick={handleRemove}
              disabled={loading}
              className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Importer une photo depuis votre ordinateur
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
          id="avatar-file-input"
        />
        <label
          htmlFor="avatar-file-input"
          className={`flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors cursor-pointer hover:border-zinc-400 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-transparent" />
              Upload en cours...
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4" />
              Choisir un fichier
            </>
          )}
        </label>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
          Formats acceptés : JPEG, PNG, GIF, WebP (max 5MB)
        </p>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            Ou
          </span>
        </div>
      </div>

      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          URL de l'avatar
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-black shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            placeholder="https://example.com/avatar.jpg"
          />
          <button
            onClick={handleSave}
            disabled={loading || avatarUrl === (currentAvatar || "")}
            className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {saved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {loading ? "Enregistrement..." : saved ? "Enregistré" : "Enregistrer"}
          </button>
        </div>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
          Entrez l'URL d'une image pour votre avatar
        </p>
      </div>

      {/* Preview */}
      {avatarUrl && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Aperçu
          </p>
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-zinc-200 dark:border-zinc-800">
            <Image
              src={avatarUrl}
              alt="Aperçu avatar"
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = ""
                e.currentTarget.style.display = "none"
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

