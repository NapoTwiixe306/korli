/**
 * Block layout system for user pages.
 * 
 * Defines various grid layouts (list, bento-style, grid) with CSS Grid configurations.
 * Each layout specifies column/row templates and optional block spanning.
 */

export type LayoutType = "list" | "bento-1" | "bento-2" | "bento-3" | "bento-4" | "grid-2" | "grid-3"

/**
 * Configuration for a block layout.
 */
export interface LayoutConfig {
  name: string
  description: string
  preview: string
  gridColumns: string
  gridRows?: string
  blockSpans?: Record<number, { colSpan?: number; rowSpan?: number }>
}

/**
 * Available layouts with their grid configurations.
 */
export const LAYOUTS: Record<LayoutType, LayoutConfig> = {
  list: {
    name: "Liste",
    description: "Disposition verticale classique (comme Linktree)",
    preview: "Tous les blocs en colonne",
    gridColumns: "1fr",
  },
  "bento-1": {
    name: "Bento 1",
    description: "Grand bloc en haut, petits en bas",
    preview: "1 grand + 2 petits",
    gridColumns: "repeat(2, 1fr)",
    gridRows: "repeat(3, 1fr)",
    blockSpans: {
      0: { colSpan: 2, rowSpan: 2 },
    },
  },
  "bento-2": {
    name: "Bento 2",
    description: "Blocs de tailles variées en grille",
    preview: "Mix de tailles",
    gridColumns: "repeat(3, 1fr)",
    gridRows: "repeat(3, 1fr)",
    blockSpans: {
      2: { colSpan: 2, rowSpan: 2 },
    },
  },
  "bento-3": {
    name: "Bento 3",
    description: "Grille asymétrique moderne",
    preview: "Asymétrique",
    gridColumns: "repeat(3, 1fr)",
    gridRows: "repeat(3, 1fr)",
    blockSpans: {
      1: { colSpan: 2, rowSpan: 2 },
    },
  },
  "bento-4": {
    name: "Bento 4",
    description: "Grille équilibrée avec blocs moyens",
    preview: "Équilibré",
    gridColumns: "repeat(3, 1fr)",
    gridRows: "repeat(2, 1fr)",
  },
  "grid-2": {
    name: "Grille 2 colonnes",
    description: "Deux colonnes égales",
    preview: "2 colonnes",
    gridColumns: "repeat(2, 1fr)",
  },
  "grid-3": {
    name: "Grille 3 colonnes",
    description: "Trois colonnes égales",
    preview: "3 colonnes",
    gridColumns: "repeat(3, 1fr)",
  },
}

/**
 * Retrieves layout configuration by identifier.
 * 
 * @param layout - Layout identifier
 * @returns LayoutConfig object with grid specifications
 */
export function getLayoutConfig(layout: string): LayoutConfig {
  return LAYOUTS[layout as LayoutType] || LAYOUTS.list
}
