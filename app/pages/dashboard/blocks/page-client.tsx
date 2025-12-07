"use client"

import { useState, useEffect } from "react"
import { Blocks, Plus } from "lucide-react"
import { BlockForm } from "./components/block-form"
import { BlocksList } from "./components/blocks-list"
import { useRouter } from "next/navigation"

interface Block {
  id: string
  title: string
  url: string | null
  type: string
  icon: string | null
  order: number
  isActive: boolean
}

interface BlocksPageClientProps {
  initialBlocks: Block[]
}

export function BlocksPageClient({ initialBlocks }: BlocksPageClientProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  const refreshBlocks = async () => {
    router.refresh()
    // Re-fetch blocks
    const response = await fetch("/api/blocks")
    if (response.ok) {
      const data = await response.json()
      setBlocks(data.blocks || [])
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
              Gestion des blocs
            </h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Ajoutez et organisez vos liens. Les blocs par défaut peuvent être modifiés, activés ou supprimés.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <button
              onClick={async () => {
                try {
                  const response = await fetch("/api/blocks/add-defaults", {
                    method: "POST",
                  })
                  const data = await response.json()
                  if (response.ok) {
                    if (data.blocksAdded > 0) {
                      refreshBlocks()
                    } else {
                      alert("Tous les blocs par défaut sont déjà présents")
                    }
                  } else {
                    alert(data.error || "Erreur lors de l'ajout des blocs par défaut")
                  }
                } catch (error) {
                  alert("Erreur lors de l'ajout des blocs par défaut")
                }
              }}
              className="flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              <span>Ajouter les blocs par défaut</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm sm:text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Ajouter un bloc</span>
              <span className="sm:hidden">Ajouter</span>
            </button>
          </div>
        </div>

        {blocks.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <Blocks className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
            <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
              Aucun bloc pour le moment
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Commencez par ajouter votre premier lien ou utilisez nos blocs par défaut
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch("/api/blocks/add-defaults", {
                      method: "POST",
                    })
                    if (response.ok) {
                      refreshBlocks()
                    } else {
                      alert("Erreur lors de l'ajout des blocs par défaut")
                    }
                  } catch (error) {
                    alert("Erreur lors de l'ajout des blocs par défaut")
                  }
                }}
                className="rounded-md bg-zinc-200 px-6 py-3 font-medium text-black transition-colors hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              >
                Ajouter des blocs par défaut
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="rounded-md bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Créer un bloc personnalisé
              </button>
            </div>
          </div>
        ) : (
          <BlocksList blocks={blocks} onRefresh={refreshBlocks} />
        )}
      </div>

      {showForm && (
        <BlockForm
          block={null}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            refreshBlocks()
            setShowForm(false)
          }}
        />
      )}
    </div>
  )
}

