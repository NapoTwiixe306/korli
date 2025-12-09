"use client"

import { useState, useEffect } from "react"
import { GripVertical, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { BlockForm } from "./block-form"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

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

interface SortableBlockItemProps {
  block: Block
  onEdit: (block: Block) => void
  onDelete: (blockId: string) => void
  onToggleActive: (block: Block) => void
  loading: string | null
}

function SortableBlockItem({
  block,
  onEdit,
  onDelete,
  onToggleActive,
  loading,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border p-4 sm:p-6 ${
        block.isActive
          ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
          : "border-zinc-200 bg-zinc-50 opacity-60 dark:border-zinc-800 dark:bg-zinc-900"
      }`}
    >
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing flex-shrink-0"
        >
          <GripVertical className="h-5 w-5 text-zinc-400" />
        </div>
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
          onClick={() => onToggleActive(block)}
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
          onClick={() => onEdit(block)}
          disabled={loading === block.id}
          className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-medium text-black transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(block.id)}
          disabled={loading === block.id}
          className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-zinc-700 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function BlocksList({ blocks, onRefresh }: BlocksListProps) {
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [items, setItems] = useState<Block[]>(blocks)

  // Update items when blocks prop changes
  useEffect(() => {
    setItems(blocks)
  }, [blocks])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      const previousItems = [...items]
      const newItems = arrayMove(items, oldIndex, newIndex)

      // Optimistically update UI
      setItems(newItems)

      // Update order values
      const blockOrders = newItems.map((item, index) => ({
        id: item.id,
        order: index,
      }))

      // Call API to persist the new order
      try {
        const response = await fetch("/api/blocks/reorder", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blockOrders }),
        })

        if (!response.ok) {
          throw new Error("Erreur lors du réordonnancement")
        }

        onRefresh()
      } catch (error: unknown) {
        console.error("Error reordering blocks:", error)
        alert("Erreur lors du réordonnancement des blocs")
        // Revert to previous order
        setItems(previousItems)
      }
    }
  }

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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {items.map((block) => (
              <SortableBlockItem
                key={block.id}
                block={block}
                onEdit={setEditingBlock}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                loading={loading}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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

