"use client"

import { useState } from "react"
import { ThemedPage } from "@/app/[username]/components/themed-page"
import { Palette, Layout, Zap, ExternalLink } from "lucide-react"
import type { Theme } from "@/lib/themes"
import type { LayoutType } from "@/lib/layouts"
import type { AnimationLevel } from "@/lib/animations"

// Données de démo
const demoBlocks = [
  {
    id: "demo-1",
    title: "Instagram",
    url: "https://instagram.com",
    icon: "icon:instagram",
    order: 0,
  },
  {
    id: "demo-2",
    title: "YouTube",
    url: "https://youtube.com",
    icon: "icon:youtube",
    order: 1,
  },
  {
    id: "demo-3",
    title: "Twitter/X",
    url: "https://twitter.com",
    icon: "icon:twitter/x",
    order: 2,
  },
  {
    id: "demo-4",
    title: "TikTok",
    url: "https://tiktok.com",
    icon: "icon:tiktok",
    order: 3,
  },
  {
    id: "demo-5",
    title: "Mon portfolio",
    url: "https://example.com",
    icon: "🌐",
    order: 4,
  },
  {
    id: "demo-6",
    title: "Contact",
    url: "mailto:hello@example.com",
    icon: "✉️",
    order: 5,
  },
]

const themes: Theme[] = ["default", "minimal", "dark", "colorful"]
const layouts: LayoutType[] = ["list", "grid-2", "grid-3", "bento-1", "bento-2"]
const animationLevels: AnimationLevel[] = ["all", "minimal", "none"]

export function DemoSection() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>("default")
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>("list")
  const [selectedAnimations, setSelectedAnimations] = useState<AnimationLevel>("all")

  return (
    <section id="demo" className="bg-zinc-50 py-20 sm:py-32 dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl dark:text-white">
            Demo visuelle
          </h2>
          <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
            Teste une vraie page korli en grandeur nature. Change le thème, le layout et les animations pour voir la magie opérer.
          </p>
        </div>

        {/* Contrôles */}
        <div className="mx-auto max-w-6xl mb-8">
          <div className="flex flex-wrap gap-4 justify-center items-center bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
            {/* Sélecteur de thème */}
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value as Theme)}
                className="bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm font-medium text-black dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                {themes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme === "default" && "Par défaut"}
                    {theme === "minimal" && "Minimal"}
                    {theme === "dark" && "Sombre"}
                    {theme === "colorful" && "Coloré"}
                  </option>
                ))}
              </select>
            </div>

            {/* Sélecteur de layout */}
            <div className="flex items-center gap-3">
              <Layout className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              <select
                value={selectedLayout}
                onChange={(e) => setSelectedLayout(e.target.value as LayoutType)}
                className="bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm font-medium text-black dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                {layouts.map((layout) => (
                  <option key={layout} value={layout}>
                    {layout === "list" && "Liste"}
                    {layout === "grid-2" && "Grille 2 colonnes"}
                    {layout === "grid-3" && "Grille 3 colonnes"}
                    {layout === "bento-1" && "Bento 1"}
                    {layout === "bento-2" && "Bento 2"}
                  </option>
                ))}
              </select>
            </div>

            {/* Sélecteur d'animations */}
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              <select
                value={selectedAnimations}
                onChange={(e) => setSelectedAnimations(e.target.value as AnimationLevel)}
                className="bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm font-medium text-black dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                {animationLevels.map((level) => (
                  <option key={level} value={level}>
                    {level === "all" && "Toutes"}
                    {level === "minimal" && "Minimales"}
                    {level === "none" && "Aucune"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Container de la démo - Grand rectangle */}
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden">
            {/* Barre du navigateur */}
            <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 flex items-center justify-center gap-2">
                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-md px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 flex-1 max-w-md">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">korli.fr/</span>
                    <span className="text-xs font-medium text-black dark:text-white">demo</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                    <ExternalLink className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contenu de la page - Grand rectangle */}
            <div className="relative bg-zinc-50 dark:bg-black min-h-[800px] max-h-[900px] overflow-y-auto">
              <div className="[&_.flex.min-h-screen]:min-h-0 [&_.flex.min-h-screen]:py-8 [&_.flex.min-h-screen]:px-4">
                <ThemedPage
                  userName="Demo User"
                  username="demo"
                  avatar={null}
                  userImage={null}
                  subtitle="Créateur de contenu • Designer"
                  bio="Voici un exemple de page korli 100% fonctionnelle. Clique sur les liens pour tester ! Tous les thèmes, layouts et animations sont disponibles."
                  blocks={demoBlocks}
                  smartRules={[]}
                  customTrafficSources={[]}
                  theme={selectedTheme}
                  layout={selectedLayout}
                  animations={selectedAnimations}
                  socialHeaderEnabled={false}
                  socialHeaderBlockIds={[]}
                  themeConfig={null}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            ✨ Tous les liens sont fonctionnels • 🎨 Change de thème pour voir la différence • 📱 100% responsive • ⚡ Animations en temps réel
          </p>
        </div>
      </div>
    </section>
  )
}
