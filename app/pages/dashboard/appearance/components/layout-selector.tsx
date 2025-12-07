"use client"

import { LAYOUTS, type LayoutType } from "@/lib/layouts"
import { Check } from "lucide-react"

interface LayoutSelectorProps {
  currentLayout: string
  onLayoutChange: (layout: LayoutType) => void
  saving?: boolean
}

export function LayoutSelector({
  currentLayout,
  onLayoutChange,
  saving = false,
}: LayoutSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Disposition des blocs
        </h3>
        <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-500">
          Choisissez comment vos blocs sont organisés sur votre page
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Object.entries(LAYOUTS).map(([key, layout]) => {
          const isSelected = currentLayout === key
          return (
            <button
              key={key}
              onClick={() => onLayoutChange(key as LayoutType)}
              disabled={saving}
              className={`group relative rounded-lg border-2 p-4 text-left transition-all ${
                isSelected
                  ? "border-black bg-zinc-50 dark:border-white dark:bg-zinc-800"
                  : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
              } disabled:opacity-50`}
            >
              {isSelected && (
                <div className="absolute right-2 top-2">
                  <Check className="h-4 w-4 text-black dark:text-white" />
                </div>
              )}
              <div className="mb-2">
                <div className="text-sm font-medium text-black dark:text-white">
                  {layout.name}
                </div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {layout.description}
                </div>
              </div>
              <div className="mt-3 flex h-16 items-center justify-center rounded border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                <LayoutPreview layout={key as LayoutType} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function LayoutPreview({ layout }: { layout: LayoutType }) {
  const config = LAYOUTS[layout]
  const getPreviewBlocks = (): Array<{ index: number; span?: { colSpan?: number; rowSpan?: number } }> => {
    switch (layout) {
      case "list":
        return Array(3).fill(0).map((_, i) => ({ index: i }))
      case "bento-1":
        return Array(4).fill(0).map((_, i) => ({ index: i, span: config.blockSpans?.[i] }))
      case "bento-2":
        return Array(5).fill(0).map((_, i) => ({ index: i, span: config.blockSpans?.[i] }))
      case "bento-3":
        return Array(5).fill(0).map((_, i) => ({ index: i, span: config.blockSpans?.[i] }))
      case "bento-4":
        return Array(6).fill(0).map((_, i) => ({ index: i }))
      case "grid-2":
        return Array(4).fill(0).map((_, i) => ({ index: i }))
      case "grid-3":
        return Array(6).fill(0).map((_, i) => ({ index: i }))
      default:
        return Array(3).fill(0).map((_, i) => ({ index: i }))
    }
  }

  const blocks = getPreviewBlocks()

  return (
    <div
      className="grid h-full w-full gap-1 p-1"
      style={{
        gridTemplateColumns: config.gridColumns,
        gridTemplateRows: config.gridRows || "auto",
      }}
    >
      {blocks.map((block) => (
        <div
          key={block.index}
          className="rounded bg-zinc-300 dark:bg-zinc-600"
          style={{
            gridColumn: `span ${block.span?.colSpan || 1}`,
            gridRow: `span ${block.span?.rowSpan || 1}`,
          }}
        />
      ))}
    </div>
  )
}

