import { Suspense } from "react"
import ResearcherInfo from "./researcher-info";
import ResearcherInfoDisplay from "./researcher-info-display";
import ResearcherPublications from "./researcher-publications";
import ResearcherPublicationsDisplay from "./researcher-publications-display";

export default function Page({
    searchParams,
  }: {
    searchParams: { resolvedPid?: string }
  }) {
    const pid = searchParams.resolvedPid || ""
  
    return (
      <>
        <Suspense fallback={<ResearcherInfoDisplay />}>
          <ResearcherInfo pid={pid} />
        </Suspense>
        <Suspense fallback={<ResearcherPublicationsDisplay />}>
          <ResearcherPublications pid={pid} />
        </Suspense>
      </>
    )
  }