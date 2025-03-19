import { getPublicationsById } from "@/lib/db/action"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json([])
  }

  try {
    const publication = await getPublicationsById(parseInt(id))
    return NextResponse.json(publication)
  } catch (error) {
    console.error("Error searching researchers:", error)
    return NextResponse.json({ error: "Failed to search researchers" }, { status: 500 })
  }
}