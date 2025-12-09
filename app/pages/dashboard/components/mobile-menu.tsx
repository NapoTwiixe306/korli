"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  BarChart3,
  Lightbulb,
  Blocks,
  Palette,
  Sparkles,
  TrendingUp,
  Globe,
  Activity,
  User,
  CreditCard,
  Settings,
  Link2,
  FileText,
  Menu,
  X,
  ChevronDown,
} from "lucide-react"

const navItems = [
  { href: "/pages/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/pages/dashboard/insights", label: "Insights", icon: BarChart3 },
  { href: "/pages/dashboard/recommendations", label: "Recommandations", icon: Lightbulb },
  { href: "/pages/dashboard/blocks", label: "Blocs", icon: Blocks },
  { href: "/pages/dashboard/appearance", label: "Apparence", icon: Palette },
  { href: "/pages/dashboard/smart-rules", label: "Règles intelligentes", icon: Sparkles, disabled: true },
  { href: "/pages/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/pages/dashboard/traffic-sources", label: "Sources de trafic", icon: Globe },
  { href: "/pages/dashboard/performance", label: "Performance", icon: Activity },
  { href: "/pages/dashboard/profile", label: "Profil", icon: User },
  { href: "/pages/dashboard/billing", label: "Facturation", icon: CreditCard },
  { href: "/pages/dashboard/settings", label: "Paramètres", icon: Settings },
  { href: "/pages/dashboard/shortlinks", label: "Liens courts", icon: Link2 },
  { href: "/pages/dashboard/mini-forms", label: "Mini-formulaires", icon: FileText },
]

export function MobileMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md p-2 text-black dark:text-white"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          {/* Menu */}
          <div className="fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 max-w-[85vw] rounded-l-lg border-l border-t border-b border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="max-h-full space-y-1 overflow-y-auto p-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <button
                  key={item.href}
                  onClick={() => !item.disabled && handleSelect(item.href)}
                  disabled={item.disabled}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-zinc-100 font-medium text-black dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.disabled && (
                    <span className="ml-auto text-xs text-zinc-400">Bientôt</span>
                  )}
                </button>
              )
            })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
