import type { ReactNode } from "react"

// Le layout gère l'attente des params
export default async function ResearcherLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ pid: string[] }>
}) {
  // Résoudre les params dans le layout
  const resolvedParams = await params
  const pid = resolvedParams.pid.join("/")

  // Passer le pid résolu via searchParams
  const searchParams = new URLSearchParams()
  searchParams.set("resolvedPid", pid)

  return (
    <main className="flex flex-col h-full w-full items-center justify-start p-4">
      <section className="w-full max-w-4xl space-y-4">{children}</section>
    </main>
  )
}

