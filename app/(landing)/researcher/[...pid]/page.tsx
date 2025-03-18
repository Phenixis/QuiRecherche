import ResearcherInfo from "./researcher-info";
import ResearcherInfoDisplay from "./researcher-info-display";
import { Suspense } from "react";
import ResearcherPublications from "./researcher-publications";
import ResearcherPublicationsDisplay from "./researcher-publications-display";

export default async function Page({
    params
}: {
    params: Promise<{
        pid: string[]
    }>
}) {
    const pid = (await params).pid ? (await params).pid.join("/") : "";


    return (
        <main className="flex flex-col h-full w-full items-center justify-start p-4" >
            <section className="w-full max-w-4xl space-y-4">
                <Suspense fallback={<ResearcherInfoDisplay />}>
                    <ResearcherInfo pid={pid} />
                </Suspense>
                <Suspense fallback={<ResearcherPublicationsDisplay />}>
                    <ResearcherPublications pid={pid} />
                </Suspense>
            </section>
        </main>
    )
}