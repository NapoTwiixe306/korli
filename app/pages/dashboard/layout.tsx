import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"
import { SignOutButton } from "./components/sign-out-button"
import { MobileMenu } from "./components/mobile-menu"
import { Sidebar } from "./components/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* User info and sign out - Desktop */}
        <div className="hidden border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900 lg:flex lg:justify-end">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-black dark:text-white">
                {session.user.name || session.user.email}
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>

        {/* Mobile header */}
        <header className="border-b border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/pages/dashboard" className="text-lg font-bold text-black dark:text-white">
              korli
            </Link>
            <MobileMenu />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}



