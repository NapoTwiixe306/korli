"use client"

import { useState } from "react"
import { GripVertical, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { BlockForm } from "./block-form"

interface Block {
  id: string
  title: string
  url: string | null
  type: string
  icon: string | null
  order: number
  isActive: boolean
}

interface BlocksListProps {
  blocks: Block[]
  onRefresh: () => void
}

export function BlocksList({ blocks, onRefresh }: BlocksListProps) {
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const handleDelete = async (blockId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce bloc ?")) {
      return
    }

    setLoading(blockId)
    try {
      const response = await fetch(`/api/blocks/${blockId}/delete`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      onRefresh()
    } catch (error) {
      alert("Erreur lors de la suppression du bloc")
    } finally {
      setLoading(null)
    }
  }

  const handleToggleActive = async (block: Block) => {
    setLoading(block.id)
    try {
      const response = await fetch(`/api/blocks/${block.id}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !block.isActive,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour")
      }

      onRefresh()
    } catch (error) {
      alert("Erreur lors de la mise à jour du bloc")
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <div className="space-y-4">
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border p-4 sm:p-6 ${
              block.isActive
                ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                : "border-zinc-200 bg-zinc-50 opacity-60 dark:border-zinc-800 dark:bg-zinc-900"
            }`}
          >
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <GripVertical className="h-5 w-5 text-zinc-400 cursor-move flex-shrink-0" />
              {block.icon && (
                <span className="text-2xl flex-shrink-0">{block.icon}</span>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-black dark:text-white break-words">
                    {block.title}
                  </span>
                  {!block.isActive && (
                    <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 whitespace-nowrap">
                      Inactif
                    </span>
                  )}
                </div>
                {block.url && (
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 break-all">
                    {block.url.length > 50
                      ? `${block.url.substring(0, 50)}...`
                      : block.url}
                  </div>
                )}
                {!block.isActive && (
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                    Modifiez ce bloc et ajoutez votre URL pour l'activer
                  </div>
                )}
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                  Type: {block.type} • Ordre: {block.order}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 sm:ml-4">
              <button
                onClick={() => handleToggleActive(block)}
                disabled={loading === block.id}
                className="rounded-md border border-zinc-300 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                title={block.isActive ? "Désactiver" : "Activer"}
              >
                {block.isActive ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => setEditingBlock(block)}
                disabled={loading === block.id}
                className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-medium text-black transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(block.id)}
                disabled={loading === block.id}
                className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-zinc-700 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingBlock && (
        <BlockForm
          block={editingBlock}
          onClose={() => setEditingBlock(null)}
          onSuccess={onRefresh}
        />
      )}
    </>
  )
}

