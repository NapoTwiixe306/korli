"use client"

import Link from "next/link"
import { Instagram, Twitter } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-black dark:text-white">
              korli
            </Link>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              La plateforme de liens intelligente qui s'adapte à chaque visiteur.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com/julien.mlnts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors hover:text-pink-600 dark:hover:text-pink-400"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/JulienMl3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors hover:text-blue-500 dark:hover:text-blue-400"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white">Produit</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                >
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                >
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link
                  href="#benefits"
                  className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                >
                  Avantages
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                >
                  Créer un compte
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white">Légal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                >
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                >
                  Politique des cookies
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © {currentYear} korli. Tous droits réservés.
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Fait avec ❤️ pour les créateurs
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
