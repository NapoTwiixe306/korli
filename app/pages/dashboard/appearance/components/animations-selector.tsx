"use client"

import { Sparkles, Zap, Minus } from "lucide-react"
import type { AnimationLevel } from "@/lib/animations"

interface AnimationsSelectorProps {
  currentAnimations: AnimationLevel
  onAnimationsChange: (level: AnimationLevel) => void
  saving?: boolean
}

export function AnimationsSelector({
  currentAnimations,
  onAnimationsChange,
  saving = false,
}: AnimationsSelectorProps) {
  const options: { value: AnimationLevel; label: string; description: string; icon: React.ReactNode }[] = [
    {
      value: "all",
      label: "Toutes les animations",
      description: "Effets complets avec transitions et transformations",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      value: "minimal",
      label: "Minimal",
      description: "Seulement les effets de survol légers",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      value: "none",
      label: "Aucune animation",
      description: "Désactiver toutes les animations",
      icon: <Minus className="h-5 w-5" />,
    },
  ]

  return (
    <div className="space-y-3">
      <div>
        <h3 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Niveau d'animations
        </h3>
        <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-500">
          Choisissez le niveau d'animations et d'effets pour votre page
        </p>
      </div>

      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = currentAnimations === option.value
          return (
            <button
              key={option.value}
              onClick={() => onAnimationsChange(option.value)}
              disabled={saving}
              className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
                isSelected
                  ? "border-black bg-zinc-50 dark:border-white dark:bg-zinc-800"
                  : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
              } disabled:opacity-50`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${isSelected ? "text-black dark:text-white" : "text-zinc-500 dark:text-zinc-400"}`}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${isSelected ? "text-black dark:text-white" : "text-zinc-700 dark:text-zinc-300"}`}>
                    {option.label}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                    {option.description}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

