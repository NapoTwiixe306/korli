import { NextResponse } from "next/server"

/**
 * GET /api/health
 * 
 * Health check endpoint for Caddy reverse proxy
 */
export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() })
}

