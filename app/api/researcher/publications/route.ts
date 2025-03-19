import { type NextRequest, NextResponse } from "next/server"
import { getPublicationsByResearcherPid } from "@/lib/db/action"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const pid = searchParams.get("pid")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Validate required parameters
    if (!pid) {
      return NextResponse.json({ error: "Missing required parameter: pid" }, { status: 400 })
    }

    // Get publications with pagination
    const data = await getPublicationsByResearcherPid(pid, page, limit)

    // Return the data
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching publications:", error)
    return NextResponse.json({ error: "Failed to fetch publications" }, { status: 500 })
  }
}

