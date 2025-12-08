import type { Metadata } from "next"
import Link from "next/link"
import { Mail, Instagram, Twitter } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact | korli",
  description: "Contactez l'équipe korli pour toute question ou demande de support",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-block text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="text-4xl font-bold text-black dark:text-white">
          Contactez-nous
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question, 
          suggestion ou problème.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {/* Email */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <Mail className="h-6 w-6 text-black dark:text-white" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-black dark:text-white">
              Email
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Pour toute question générale ou demande de support
            </p>
            <a
              href="mailto:contact@korli.fr"
              className="mt-4 inline-block text-sm font-medium text-black underline dark:text-white"
            >
              contact@korli.fr
            </a>
          </div>

          {/* Instagram */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/20">
              <Instagram className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-black dark:text-white">
              Instagram
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Suivez-nous pour les dernières actualités
            </p>
            <a
              href="https://instagram.com/julien.mlnts"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-black underline dark:text-white"
            >
              @julien.mlnts
            </a>
          </div>

          {/* Twitter */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:col-span-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Twitter className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-black dark:text-white">
              Twitter
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Restez informé de nos mises à jour et nouveautés
            </p>
            <a
              href="https://twitter.com/JulienMl3"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-black underline dark:text-white"
            >
              @JulienMl3
            </a>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Temps de réponse
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Nous nous efforçons de répondre à toutes les demandes dans un délai de 48 heures. 
            Pour les questions urgentes, n'hésitez pas à nous contacter via nos réseaux sociaux.
          </p>
        </div>
      </div>
    </div>
  )
}

