"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { AuthDropdown } from "./auth-dropdown"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-black dark:text-white">
              korli
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
            >
              Comment ça marche
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
            >
              Avantages
            </Link>
            <AuthDropdown />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-zinc-200 py-4 dark:border-zinc-800 md:hidden">
            <div className="flex flex-col space-y-4">
              <Link
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
              >
                Fonctionnalités
              </Link>
              <Link
                href="#how-it-works"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
              >
                Comment ça marche
              </Link>
              <Link
                href="#benefits"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
              >
                Avantages
              </Link>
              <div className="mx-4">
                <AuthDropdown />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
