import { searchResearcher } from "@/lib/db/action"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json([])
  }

  try {
    const researchers = await searchResearcher(query)
    return NextResponse.json(researchers)
  } catch (error) {
    console.error("Error searching researchers:", error)
    return NextResponse.json({ error: "Failed to search researchers" }, { status: 500 })
  }
}