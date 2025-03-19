import { getPublicationsByResearcherPid } from "@/lib/db/action"
import ResearcherPublicationsDisplay from "./researcher-publications-display"

export default async function ResearcherPublications({
  pid,
  page = 1,
  limit = 10,
}: {
  pid: string
  page?: number
  limit?: number
}) {
  let publications
  let totalCount = 0

  try {
    // Assuming getPublicationsByResearcherPid can be modified to support pagination
    // If not, we'll need to handle pagination on the client side
    const result = await getPublicationsByResearcherPid(pid, page, limit)
    publications = result.publications
    totalCount = result.totalCount
  } catch (e) {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-4">
          <h1 className="text-2xl font-bold">Oupsi, on a rencontré une erreur de notre côté.</h1>
          <h2>Veuillez réessayer plus tard.</h2>
        </div>
      </main>
    )
  }

  return (
    <ResearcherPublicationsDisplay
      publications={publications}
      totalCount={totalCount}
      currentPage={page}
      limit={limit}
      pid={pid}
    />
  )
}

