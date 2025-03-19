import { getPublicationsByResearcherPid } from "@/lib/db/action"
import ResearcherPublicationsClient from "./researcher-publications-client"

export default async function ResearcherPublications({
  pid,
}: {
  pid: string
}) {
  // Initial data fetch for the first page
  let initialData

  try {
    initialData = await getPublicationsByResearcherPid(pid, 1, 10)
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

  return <ResearcherPublicationsClient initialData={initialData} pid={pid} />
}

