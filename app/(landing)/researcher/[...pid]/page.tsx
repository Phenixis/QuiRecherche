import ResearcherInfo from "./researcher-info";
import ResearcherInfoDisplay from "./researcher-info-display";
import { Suspense } from "react";
import ResearcherPublications from "./researcher-publications";
import ResearcherPublicationsDisplay from "./researcher-publications-display";

export async function generateStaticParams() {
    const posts = await fetch('/api/researcher/pid').then((res) => res.json())
   
    return posts.map((post: {
        pid: string
    }) => ({
      pid: post.pid.split("/")
    }))
  }

export default async function Page({
    params
}: {
    params: Promise<{
        pid: string[]
    }>
}) {
    // Attendre la résolution de params avant de l'utiliser
    const resolvedParams = await params
    const pid = resolvedParams.pid.join("/")

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