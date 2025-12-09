import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"
import { 
  Eye, 
  MousePointerClick, 
  Link2, 
  TrendingUp, 
  Calendar,
  Edit,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Globe
} from "lucide-react"
import { CopyButton } from "./components/copy-button"

export default async function DashboardPage() {
  const headersList = await headers()
  
  const headerEntries: [string, string][] = []
  headersList.forEach((value, key) => {
    headerEntries.push([key, value])
  })
  
  const authHeaders = new Headers(headerEntries)
  
  let session
  try {
    session = await auth.api.getSession({
      headers: authHeaders,
    })
  } catch (error) {
    redirect("/login")
  }

  if (!session?.user) {
    redirect("/login")
  }

  const userPage = await prisma.userPage.findUnique({
    where: { userId: session.user.id },
    include: {
      blocks: {
        orderBy: {
          order: "asc",
        },
      },
      user: true,
    },
  })

  if (!userPage) {
    redirect("/register")
  }

  const activeBlocks = userPage.blocks.filter((b: { isActive: boolean }) => b.isActive)
  const totalBlocks = userPage.blocks.length
  const inactiveBlocks = totalBlocks - activeBlocks.length
  
  // Calculate page completeness
  const hasBio = !!userPage.bio
  const hasAvatar = !!(userPage.avatar || userPage.user.image)
  const hasBlocks = activeBlocks.length > 0
  const pageComplete = hasBio && hasAvatar && hasBlocks
  
  // Format dates
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now()
  const createdDate = new Date(userPage.createdAt)
  const updatedDate = new Date(userPage.updatedAt)
  const daysSinceCreation = Math.floor((now - createdDate.getTime()) / (1000 * 60 * 60 * 24))
  
  // Page URL
  const pageUrl = `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000'}/${userPage.username}`

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
            Vue d'ensemble
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Vue d'ensemble de votre page korli
          </p>
        </div>

        {/* Page Status Alert */}
        {!pageComplete && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-amber-900 dark:text-amber-100">
                  Votre page n'est pas complète
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-amber-800 dark:text-amber-200 break-words">
                  {!hasBio && "Ajoutez une bio • "}
                  {!hasAvatar && "Ajoutez un avatar • "}
                  {!hasBlocks && "Ajoutez au moins un bloc"}
                </p>
              </div>
              <Link
                href="/pages/dashboard/appearance"
                className="text-xs sm:text-sm font-medium text-amber-900 hover:text-amber-700 dark:text-amber-100 dark:hover:text-amber-300 whitespace-nowrap"
              >
                Compléter →
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Blocs actifs"
            value={activeBlocks.length.toString()}
            subtitle={`${totalBlocks} au total${inactiveBlocks > 0 ? ` • ${inactiveBlocks} inactifs` : ''}`}
            icon={<Link2 className="h-8 w-8" />}
          />
          <StatCard
            title="Page créée"
            value={daysSinceCreation === 0 ? "Aujourd'hui" : `Il y a ${daysSinceCreation} jour${daysSinceCreation > 1 ? 's' : ''}`}
            subtitle={createdDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            icon={<Calendar className="h-8 w-8" />}
          />
          <StatCard
            title="Dernière modification"
            value={updatedDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
            subtitle={updatedDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            icon={<Edit className="h-8 w-8" />}
          />
          <StatCard
            title="État de la page"
            value={pageComplete ? "Complète" : "Incomplète"}
            subtitle={pageComplete ? "Prête à partager" : "À compléter"}
            icon={pageComplete ? <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" /> : <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Page Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page Overview Card */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-black dark:text-white">
                  Aperçu de votre page
                </h2>
                <Link
                  href={`/${userPage.username}`}
                  target="_blank"
                  className="flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Voir en public
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              
              {/* Mini Preview */}
              <div className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col items-center space-y-4">
                  {/* Avatar Preview */}
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200 text-2xl font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {(userPage.user.name || userPage.username).charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Name & Bio Preview */}
                  <div className="text-center">
                    <div className="font-semibold text-black dark:text-white">
                      {userPage.user.name || userPage.username}
                    </div>
                    {userPage.bio ? (
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {userPage.bio}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 italic">
                        Aucune bio
                      </p>
                    )}
                  </div>
                  
                  {/* Blocks Preview */}
                  <div className="w-full space-y-2">
                    {activeBlocks.slice(0, 3).map((block: { id: string; title: string; type: string }) => (
                      <div
                        key={block.id}
                        className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                      >
                        {block.title}
                      </div>
                    ))}
                    {activeBlocks.length > 3 && (
                      <div className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                        +{activeBlocks.length - 3} autre{activeBlocks.length - 3 > 1 ? 's' : ''} bloc{activeBlocks.length - 3 > 1 ? 's' : ''}
                      </div>
                    )}
                    {activeBlocks.length === 0 && (
                      <div className="text-center text-xs text-zinc-400 dark:text-zinc-500 italic">
                        Aucun bloc
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Page URL */}
              <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                  <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    URL de votre page
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 font-mono text-sm font-semibold text-black dark:text-white">
                    {pageUrl}
                  </div>
                  <CopyButton url={pageUrl} />
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/${userPage.username}`}
                  target="_blank"
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  <ExternalLink className="h-4 w-4" />
                  Voir ma page
                </Link>
                <Link
                  href="/pages/dashboard/blocks"
                  className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-center text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
                >
                  Gérer les blocs
                </Link>
              </div>
            </div>

            {/* Recent Blocks */}
            <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-black dark:text-white">
                  Vos blocs
                </h2>
                <Link
                  href="/pages/dashboard/blocks"
                  className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Tout voir →
                </Link>
              </div>

              {activeBlocks.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Aucun bloc pour le moment
                  </p>
                  <Link
                    href="/pages/dashboard/blocks"
                    className="mt-4 inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Ajouter votre premier bloc
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBlocks.slice(0, 5).map((block: { id: string; title: string; url: string | null; type: string; icon: string | null }) => (
                    <div
                      key={block.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        {block.icon && (
                          <span className="text-xl">{block.icon}</span>
                        )}
                        <div>
                          <div className="font-medium text-black dark:text-white">
                            {block.title}
                          </div>
                          {block.url && (
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                              {block.url.length > 50
                                ? `${block.url.substring(0, 50)}...`
                                : block.url}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {block.type}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Actions rapides
              </h2>
              <div className="space-y-2">
                <Link
                  href="/pages/dashboard/blocks"
                  className="block rounded-md bg-zinc-100 px-4 py-3 text-center text-sm font-medium text-black transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                >
                  Ajouter un bloc
                </Link>
                <Link
                  href="/pages/dashboard/appearance"
                  className="block rounded-md bg-zinc-100 px-4 py-3 text-center text-sm font-medium text-black transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                >
                  Personnaliser le design
                </Link>
                <Link
                  href="/pages/dashboard/analytics"
                  className="block rounded-md bg-zinc-100 px-4 py-3 text-center text-sm font-medium text-black transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                >
                  Voir les analytics
                </Link>
              </div>
            </div>

            {/* Page Status */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                État de la page
              </h2>
              <div className="space-y-3">
                <StatusItem
                  label="Bio"
                  status={hasBio}
                  action={!hasBio ? { href: "/pages/dashboard/appearance", text: "Ajouter" } : undefined}
                />
                <StatusItem
                  label="Avatar"
                  status={hasAvatar}
                  action={!hasAvatar ? { href: "/pages/dashboard/appearance", text: "Ajouter" } : undefined}
                />
                <StatusItem
                  label="Blocs"
                  status={hasBlocks}
                  value={activeBlocks.length > 0 ? `${activeBlocks.length} actif${activeBlocks.length > 1 ? 's' : ''}` : undefined}
                  action={!hasBlocks ? { href: "/pages/dashboard/blocks", text: "Ajouter" } : undefined}
                />
                <StatusItem
                  label="Thème"
                  status={true}
                  value={userPage.theme}
                  action={{ href: "/pages/dashboard/appearance", text: "Modifier" }}
                />
              </div>
            </div>

            {/* Page Info */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Informations
              </h2>
              <div className="space-y-3 text-sm">
                <InfoItem
                  label="Nom d'utilisateur"
                  value={userPage.username}
                />
                <InfoItem
                  label="Créée le"
                  value={createdDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                />
                <InfoItem
                  label="Dernière modification"
                  value={updatedDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{title}</p>
          <p className="mt-2 text-2xl font-bold text-black dark:text-white">
            {value}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500 line-clamp-2">
            {subtitle}
          </p>
        </div>
        <div className="text-zinc-400 dark:text-zinc-600">{icon}</div>
      </div>
    </div>
  )
}

function StatusItem({
  label,
  status,
  value,
  action,
}: {
  label: string
  status: boolean
  value?: string
  action?: { href: string; text: string }
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {status ? (
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        ) : (
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        )}
        <span className="text-sm text-zinc-600 dark:text-zinc-400">{label}</span>
        {value && (
          <span className="text-xs text-zinc-500 dark:text-zinc-500">({value})</span>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="text-xs font-medium text-black hover:underline dark:text-white"
        >
          {action.text}
        </Link>
      )}
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
      <span className="font-medium text-black dark:text-white">{value}</span>
    </div>
  )
}


