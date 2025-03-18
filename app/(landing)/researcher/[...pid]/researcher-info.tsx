import { getResearcher, getUniversitiesByResearcherPid } from "@/lib/db/action";
import ResearcherInfoDisplay from "./researcher-info-display";

export default async function ResearcherInfo({
    pid
}: {
    pid: string
}) {
    let researcher;
    let universities;

    try {
        researcher = await getResearcher(pid);
        universities = await getUniversitiesByResearcherPid(researcher[0].pid);
    } catch (e) {
        return (
            <main className="flex flex-col min-h-screen items-center justify-center p-4" >
                <div className="w-full max-w-4xl space-y-4" >
                    <h1 className="text-2xl font-bold" > Oupsi, on a rencontré une erreur de notre côté. </h1>
                    <h2 > Veuillez réessayer plus tard. </h2>
                </div>
            </main>
        )
    }

    return (
        <ResearcherInfoDisplay researcher={researcher[0]} universities={universities} />
    )
}