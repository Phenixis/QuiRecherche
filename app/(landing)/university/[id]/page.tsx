import { db } from "@/lib/db/drizzle";
import { university as universityTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import * as actions from "@/lib/db/action";
import { type Affiliation, type Researcher } from "@/lib/db/schema";

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id);
  const university = (
    await db.select().from(universityTable).where(eq(universityTable.id, id))
  )[0];
  const affiliations: Affiliation[] =
    await actions.getAffiliationByUniversityId(id);
  const researchers: Researcher[] = [];

  for (const affiliation of affiliations) {
    const researcher = await actions.getResearcher(affiliation.researcherPid);
    if (researcher) {
      researchers.push(researcher[0]);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="font-bold">{university.name}</h1>
      {researchers.map((researcher) => (
        <div key={researcher.pid}>
          <a href={`/researcher/${researcher.pid}`}>
            {researcher.first_name} {researcher.last_name}
          </a>
        </div>
      ))}
      <pre>{JSON.stringify(researchers, null, 2)}</pre>
    </div>
  );
}
