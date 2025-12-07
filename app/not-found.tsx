import Link from "next/link"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-zinc-200 dark:text-zinc-800 mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
            Page not found
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-zinc-300 dark:border-zinc-700 text-black dark:text-white rounded-lg font-medium hover:border-black dark:hover:border-white transition-colors"
          >
            <Search className="w-4 h-4" />
            Create Your Page
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-4">
            Popular pages:
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

