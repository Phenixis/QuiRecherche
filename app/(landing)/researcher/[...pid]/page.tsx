import { db } from "@/lib/db/drizzle";
import {
  researcher,
  paper,
  contribution,
  typePublication,
} from "@/lib/db/schema";
import { eq, and, isNull, isNotNull } from "drizzle-orm";
import Publication from "@/app/(landing)/test/publication";
import { getAllInfosResearcher } from "@/lib/db/action";
import { getAllResearchers } from "@/lib/db/action";

export default async function Page({ params }: { params: { pid: string[] } }) {
  const pid = params.pid ? params.pid.join("/") : "";
  const data = await getAllInfosResearcher(pid);

  if (!(data.researcher && data.universities && data.papers && data.articles)) {
    return <div>{data.error}</div>;
  }

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-4">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className="w-full max-w-4xl space-y-4">
        <h1 className="text-2xl font-bold">
          Publication de {data.researcher?.first_name}{" "}
          {data.researcher.last_name}
        </h1>
        <h1 className="text-2xl">{data.universities[0].name}</h1>
        <div>
          {data.papers.map((paper) => (
            <Publication
              title={paper.titre}
              type={paper.typePublication.abbreviation}
              researchers={["TEST", "test"]}
              doi={paper.doi || ""}
              pages={paper.page_start + "-" + paper.page_end}
              acronym={paper.venue || ""}
              dblp={"test"}
              year={paper.year}
              ee={paper.ee || ""}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
