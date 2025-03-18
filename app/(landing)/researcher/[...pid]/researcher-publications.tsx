import { getPublicationsByResearcherPid } from "@/lib/db/action"
import ResearcherPublicationsDisplay from "./researcher-publications-display"

export default async function ResearcherPublications({
    pid
}: {
    pid: string
}) {
    let publications

    try {
        publications = await getPublicationsByResearcherPid(pid)
    } catch (e) {
        return (
            <main className="flex flex-col min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-4xl space-y-4">
                    <h1 className="text-2xl font-bold">Oupsi, on a rencontré une erreur de notre côté.</h1>
                    <h2>
                        Veuillez réessayer plus tard.
                    </h2>
                </div>
            </main>
        )
    }

    return (
        <ResearcherPublicationsDisplay publications={publications} />
    )
}