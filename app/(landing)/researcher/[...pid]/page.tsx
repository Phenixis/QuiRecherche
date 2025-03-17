import { db } from "@/lib/db/drizzle";
import {
  researcher,
  paper,
  contribution,
  typePublication,
} from "@/lib/db/schema";
import { eq, and, isNull, isNotNull } from "drizzle-orm";
import Publication from "@/app/(landing)/test/publication";

export default async function Page({ params }: { params: { pid: string[] } }) {
  const pid = params.pid ? params.pid.join("/") : "";
  const data = await db
    .select()
    .from(researcher)
    .where(eq(researcher.pid, pid));

  const papers = await db
    .select()
    .from(paper)
    .innerJoin(contribution, eq(paper.id, contribution.paperId))
    .where(
      and(
        eq(contribution.researcherPid, pid),
        isNotNull(contribution.researcherPid)
      )
    );

  const type_publi = await db.select().from(typePublication);

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-4">
        <h1>Page {pid}</h1>
        {papers.map(({ paper, contribution }) => (
          <Publication
            key={paper.id}
            title={paper.titre}
            type={
              type_publi.find((tp) => tp.id === paper.typePublicationId)
                ?.abbreviation || ""
            }
            researchers={["TEST", "Test2"]}
            doi={paper.doi || ""}
            pages={paper.page_start + "-" + paper.page_end}
            acronym={paper.venue || ""}
            year={paper.year}
            dblp={paper.dblp_id || ""}
            ee={paper.ee || ""}
          />
        ))}
      </div>
    </main>
  );
}
