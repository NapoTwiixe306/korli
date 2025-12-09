"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Folder,
  LayoutTemplate,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

interface NavSection {
  title: string
  icon: React.ReactNode
  items: {
    href: string
    label: string
    icon: React.ReactNode
    disabled?: boolean
  }[]
}

const navSections: NavSection[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    items: [
      { href: "/pages/dashboard", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
      { href: "/pages/dashboard/insights", label: "Insights", icon: <BarChart3 className="h-4 w-4" /> },
      { href: "/pages/dashboard/recommendations", label: "Recommendations", icon: <Lightbulb className="h-4 w-4" /> },
    ],
  },
  {
    title: "Page Builder",
    icon: <Blocks className="h-5 w-5" />,
    items: [
      { href: "/pages/dashboard/blocks", label: "Blocks", icon: <Blocks className="h-4 w-4" /> },
      { href: "/pages/dashboard/appearance", label: "Appearance", icon: <Palette className="h-4 w-4" /> },
      { href: "/pages/dashboard/smart-rules", label: "Smart Rules", icon: <Sparkles className="h-4 w-4" /> },
    ],
  },
  {
    title: "Engagement",
    icon: <TrendingUp className="h-5 w-5" />,
    items: [
      { href: "/pages/dashboard/analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
      { href: "/pages/dashboard/traffic-sources", label: "Traffic Sources", icon: <Globe className="h-4 w-4" /> },
      { href: "/pages/dashboard/performance", label: "Performance", icon: <Activity className="h-4 w-4" /> },
    ],
  },
  {
    title: "Account",
    icon: <User className="h-5 w-5" />,
    items: [
      { href: "/pages/dashboard/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
      { href: "/pages/dashboard/billing", label: "Billing", icon: <CreditCard className="h-4 w-4" /> },
      { href: "/pages/dashboard/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
    ],
  },
]

const toolsItems = [
  { href: "/pages/dashboard/shortlinks", label: "Shortlinks", icon: <Link2 className="h-4 w-4" /> },
  { href: "/pages/dashboard/mini-forms", label: "Mini-Forms", icon: <FileText className="h-4 w-4" /> },
  { href: "/pages/dashboard/files", label: "Files", icon: <Folder className="h-4 w-4" />, comingSoon: true },
  { href: "/pages/dashboard/templates", label: "Templates", icon: <LayoutTemplate className="h-4 w-4" />, comingSoon: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>(() => {
    // Open sections that contain the current path
    const currentSection = navSections.find((section) =>
      section.items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
    )
    return currentSection ? [currentSection.title] : ["Dashboard"]
  })

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href === "/pages/dashboard") {
      return pathname === href
    }
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <aside className="hidden w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-[72px] items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
          <Link href="/pages/dashboard" className="text-xl font-bold text-black dark:text-white">
            korli
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navSections.map((section) => {
            const isOpen = openSections.includes(section.title)
            const hasActiveItem = section.items.some((item) => isActive(item.href))

            return (
              <div key={section.title} className="space-y-1">
                <button
                  onClick={() => toggleSection(section.title)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    hasActiveItem
                      ? "bg-zinc-100 text-black dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <span>{section.title}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {isOpen && (
                  <div className="ml-4 space-y-1 border-l border-zinc-200 pl-4 dark:border-zinc-800">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive(item.href)
                            ? "bg-zinc-100 font-medium text-black dark:bg-zinc-800 dark:text-white"
                            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                        } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={(e) => item.disabled && e.preventDefault()}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        {item.disabled && (
                          <span className="ml-auto text-xs text-zinc-400">Soon</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Tools Section */}
          <div className="mt-6 space-y-1 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Tools
            </div>
            {toolsItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive(item.href)
                    ? "bg-zinc-100 font-medium text-black dark:bg-zinc-800 dark:text-white"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                } ${item.comingSoon ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={(e) => item.comingSoon && e.preventDefault()}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.comingSoon && (
                  <span className="ml-auto text-xs text-zinc-400">Soon</span>
                )}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  )
}

