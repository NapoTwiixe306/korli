"use client"

import Link from "next/link"
import {
  Sparkles,
  BarChart3,
  Palette,
  Link2,
  Zap,
  Layout,
  Smartphone,
  Globe,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Blocks,
  Eye,
  Target,
} from "lucide-react"

export function LandingSections() {
  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden bg-white py-20 sm:py-32 dark:bg-black transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl md:text-6xl dark:text-white">
              Ta page de liens,
              <span className="block text-zinc-700 dark:text-zinc-300">
                mais en mieux
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-700 sm:text-xl dark:text-zinc-300">
              Fini les pages de liens statiques. Avec <span className="font-semibold text-black dark:text-white">korli</span>, 
              crée une page qui s'adapte vraiment à tes visiteurs. Analytics gratuits, design au top, 
              et tout ça sans te ruiner.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="w-full rounded-md bg-black px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-zinc-800 sm:w-auto dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Créer ma page gratuitement
              </Link>
              <Link
                href="#features"
                className="w-full rounded-md border-2 border-zinc-300 bg-white px-8 py-3 text-base font-semibold text-black transition-colors hover:bg-zinc-50 sm:w-auto dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
              >
                Découvrir les fonctionnalités
              </Link>
            </div>
            <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
              Gratuit • Pas de CB • Prêt en 2 min
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-zinc-50 py-20 sm:py-32 dark:bg-zinc-950 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl dark:text-white">
              Tout ce qu'il te faut
            </h2>
            <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
              Des outils qui servent vraiment, pas juste pour faire joli
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="flex flex-col rounded-xl border border-zinc-300 bg-white p-6 transition-all duration-200 hover:border-zinc-400 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Palette className="h-5 w-5 text-purple-700 dark:text-purple-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-black dark:text-white">
              Design personnalisable
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              Thèmes, layouts, animations... Tu choisis ce qui te plaît. Ta page, tes règles.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col rounded-xl border border-zinc-300 bg-white p-6 transition-all duration-200 hover:border-zinc-400 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <BarChart3 className="h-5 w-5 text-blue-700 dark:text-blue-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-black dark:text-white">
              Analytics intégrés
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              Vues, clics, CTR... Tout est là, en temps réel. Et c'est gratuit, contrairement à Linktree.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col rounded-xl border border-zinc-300 bg-white p-6 transition-all duration-200 hover:border-zinc-400 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <Link2 className="h-5 w-5 text-green-700 dark:text-green-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-black dark:text-white">
              Shortlinks intégrés
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              Crée des liens courts avec stats. Fini Bitly ou autres outils à payer.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col rounded-xl border border-zinc-300 bg-white p-6 transition-all duration-200 hover:border-zinc-400 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Layout className="h-5 w-5 text-orange-700 dark:text-orange-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-black dark:text-white">
              Layouts variés
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              Liste classique, grille, ou Bento. Tu changes quand tu veux, sans galère.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="flex flex-col rounded-xl border border-zinc-300 bg-white p-6 transition-all duration-200 hover:border-zinc-400 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Zap className="h-5 w-5 text-yellow-700 dark:text-yellow-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-black dark:text-white">
              Configuration rapide
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              Blocs déjà prêts, interface simple. Ta page est live en 2 minutes chrono.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="flex flex-col rounded-xl border border-zinc-300 bg-white p-6 transition-all duration-200 hover:border-zinc-400 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <Globe className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-black dark:text-white">
              SEO optimisé
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              Optimisé pour Google dès le départ. Pas besoin de te prendre la tête avec ça.
            </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20 sm:py-32 dark:bg-black transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl dark:text-white">
              Comment ça marche ?
            </h2>
            <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
              Trois étapes, c'est tout. Promis, c'est vraiment simple.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white dark:bg-white dark:text-black">
                  1
                </div>
                <h3 className="mt-6 text-xl font-semibold text-black dark:text-white">
                  Crée ton compte
                </h3>
                <p className="mt-4 text-base text-zinc-700 dark:text-zinc-300">
                  Inscription en 30 secondes. Choisis ton username, ta page est créée direct.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white dark:bg-white dark:text-black">
                  2
                </div>
                <h3 className="mt-6 text-xl font-semibold text-black dark:text-white">
                  Personnalise ta page
                </h3>
                <p className="mt-4 text-base text-zinc-700 dark:text-zinc-300">
                  Ajoute tes liens, choisis un thème, mets ta bio. Les blocs par défaut sont déjà là si tu veux.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white dark:bg-white dark:text-black">
                  3
                </div>
                <h3 className="mt-6 text-xl font-semibold text-black dark:text-white">
                  Partage ton lien
                </h3>
                <p className="mt-4 text-base text-zinc-700 dark:text-zinc-300">
                  Copie ton lien et balance-le partout. Les stats arrivent en direct.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-zinc-50 py-20 sm:py-32 dark:bg-zinc-950 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl dark:text-white">
              Pourquoi korli ?
            </h2>
            <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
              Parce que Linktree, c'est bien, mais on peut faire mieux
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {/* Benefit 1 */}
            <div className="flex gap-4 rounded-lg border border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-5 w-5 text-green-700 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Analytics gratuits
                </h3>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                  Chez Linktree, les stats c'est payant. Chez nous, tout est gratuit. Vues, clics, CTR, le tout.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex gap-4 rounded-lg border border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Blocks className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Blocs par défaut inclus
                </h3>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                  6 blocs déjà prêts (Instagram, YouTube, Twitter...). Tu modifies ou tu supprimes, comme tu veux.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex gap-4 rounded-lg border border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Eye className="h-5 w-5 text-purple-700 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Preview en temps réel
                </h3>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                  Tu vois tes changements direct. Plus besoin de publier pour voir si ça rend bien.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex gap-4 rounded-lg border border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Target className="h-5 w-5 text-orange-700 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  SEO optimisé
                </h3>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                  Open Graph, structured data, sitemap... Tout est déjà fait. Google va adorer.
                </p>
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="flex gap-4 rounded-lg border border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30">
                <Smartphone className="h-5 w-5 text-pink-700 dark:text-pink-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  100% responsive
                </h3>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                  Ça marche sur mobile, tablette, desktop. Partout, tout le temps.
                </p>
              </div>
            </div>

            {/* Benefit 6 */}
            <div className="flex gap-4 rounded-lg border border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <TrendingUp className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Évolutif et moderne
                </h3>
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                  Next.js, TypeScript... On utilise les bonnes technos. Ça rame pas, ça plante pas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta" className="bg-black py-20 sm:py-32 dark:bg-zinc-950 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Prêt à te lancer ?
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-300">
              Rejoins les créateurs qui utilisent korli. Gratuit, rapide, sans prise de tête.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="w-full rounded-md bg-white px-8 py-3 text-base font-semibold text-black transition-colors hover:bg-zinc-200 sm:w-auto"
              >
                Créer mon compte gratuitement
                <ArrowRight className="ml-2 inline h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="w-full rounded-md border-2 border-white bg-transparent px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                J'ai déjà un compte
              </Link>
            </div>
            <p className="mt-6 text-sm text-zinc-400">
              ✓ Pas de CB • ✓ Prêt en 2 min • ✓ On répond à tes questions
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
