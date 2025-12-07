import { NextResponse } from "next/server"

/**
 * This route should never be reached if Caddy is configured correctly.
 * Caddy should handle ACME challenges automatically before proxying to Next.js.
 * This is just a fallback that returns 404.
 */
export async function GET() {
  return new NextResponse("Not Found", { status: 404 })
}

