import { NextRequest, NextResponse } from "next/server"

// Redirect old avatar paths to new API route for compatibility
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params
  return NextResponse.redirect(new URL(`/api/avatars/${filename}`, request.url))
}

