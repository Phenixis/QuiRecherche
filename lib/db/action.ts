import { db } from "./drizzle";
import {
    researcher as researcherTable,
    university as universityTable,
    affiliation as affiliationTable,
    typePublication as typePublicationTable,
    paper as paperTable,
    article as articleTable,
    contribution as contributionTable,
    Researcher,
    NewResearcher,
    University,
    NewUniversity,
    Affiliation,
    NewAffiliation,
    TypePublication,
    NewTypePublication,
    Paper,
    NewPaper,
    Article,
    NewArticle,
    Contribution,
    NewContribution,
    article
} from "./schema";
import {
    and,
    or,
    eq,
    sql,
    isNull,
    isNotNull,
    ExtractTablesWithRelations,
    like
} from 'drizzle-orm';
import { PgTransaction } from "drizzle-orm/pg-core";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

type Transaction = PgTransaction<PostgresJsQueryResultHKT, typeof import("@/lib/db/schema"), ExtractTablesWithRelations<typeof import("@/lib/db/schema")>>;

export async function createResearcher(pid: string, last_name: string, first_name: string, ORCID: string, scraped: number, tx?: Transaction) {
    return await (tx ? tx : db)
        .insert(researcherTable)
        .values({ pid, last_name, first_name, ORCID, scraped } as NewResearcher);
}

export async function scrapeResearcher(pid: string) {
    /**
     * Converts the Python logic to TypeScript for scraping researcher data
     * from DBLP given a PID. Parses relevant information such as
     * author name, affiliations, papers, articles, and contributions.
     */

    // Basic input validation
    if (!pid) {
        throw new Error("PID is required to scrape researcher data.");
    }

    try {
        // Fetch the XML data
        const url = `https://dblp.org/pid/${pid}.xml`;
        const response = await fetch(url);
        const xmlData = await response.text();

        // Parse the XML
        const parsedXml = await parseStringPromise(xmlData);

        // Safely navigate the parsed XML for the root element (dblpperson)
        const dblpPerson = parsedXml?.dblpperson;
        const authorName = dblpPerson?.$?.name ?? 'Unknown Author';

        // Extract <person> node if it exists (mirroring the Python code)
        // This might differ depending on the real XML structure from DBLP
        const person = dblpPerson?.person?.[0];
        if (!person) {
            throw new Error("Person node not found in the XML data.");
        }

        // Extract affiliations
        const allNotes = person.note ?? [];
        const affiliations = allNotes
            .filter((note: any) => note.$?.type === 'affiliation')
            .map((note: any) => note._ ?? '');
        const uniqueAffiliations = Array.from(new Set(affiliations));

        // Check if affiliated with IRISA
        const affiliatedWithIrisa = uniqueAffiliations.some((aff) =>
            (aff as string).toUpperCase().includes("IRISA")
        )
            ? 1
            : -1;
        if (affiliatedWithIrisa === -1) {
            // Replicate Python return if IRISA not found
            // Prepare the author data to return
            const firstName = authorName.split(' ')[0];
            const lastName = authorName.split(' ').slice(1).join(' ');

            const inDb = await getResearcher(pid);
            if (inDb.length > 0) {
                await updateResearcher(pid, lastName, firstName, '', -1);
            } else {
                await createResearcher(pid, lastName, firstName, '', -1);
            }

            return {
                pid,
                last_name: lastName,
                first_name: firstName,
                ORCID: '',
                scraped: -1
            };
        }

        // Build university list and map
        const universities: Array<{ ID: number; NOM: string; Coord: string }> = [];
        const univMap: Record<string, number> = {};
        uniqueAffiliations.forEach((univName, index) => {
            const id = index + 1;
            universities.push({ ID: id, NOM: univName as string, Coord: "" });
            univMap[univName as string] = id;
        });

        // Extract URLs
        const urls: string[] = person.url?.map((u: any) => u._) ?? [];

        // Prepare to gather papers, articles, contributions
        const researchers: Array<{ PID: string; NOM: string; PRENOM: string; ORCID: string; SCRAPED: number }> = [
            {
                PID: pid,
                NOM: authorName.split(' ').slice(1).join(' '),
                PRENOM: authorName.split(' ')[0],
                ORCID: '',
                SCRAPED: 1
            }
        ];
        const papers: any[] = [];
        const articles: any[] = [];
        const contributions: any[] = [];
        let articleIdCounter = 1;

        // Each <r> can have inproceedings or article
        const records = dblpPerson?.r ?? [];
        for (const record of records) {
            const inproceedingsList = record.inproceedings || [];
            for (const inproc of inproceedingsList) {
                const key = inproc.$?.key ?? "";
                let eeText = inproc.ee?.[0] as string ?? "";
                if (typeof eeText == "object") {
                    eeText = eeText["_"];
                }
                const doi = eeText.includes("https://doi.org/") ? eeText.replace("https://doi.org/", "") : null;
                const title = inproc.title?.[0] ?? "";
                const year = inproc.year?.[0] ?? "";
                const pages = inproc.pages?.[0] ?? "";
                const venue = inproc.booktitle?.[0] ?? "";
                papers.push({
                    doi,
                    "TYPE_PUBLICATION.id": 1,
                    titre: title,
                    venue,
                    year,
                    pages,
                    ee: eeText,
                    url_dblp: `https://dblp.org/rec/${key}`
                });

                // Contributions from authors
                const authorElems = inproc.author || [];
                authorElems.forEach((auth: any, idx: number) => {
                    const pidAttr = auth.$?.pid ?? "";
                    const authorName = auth._ ?? "";
                    const firstName = authorName.split(' ')[0];
                    const lastName = authorName.split(' ').slice(1).join(' ');
                    contributions.push({
                        "RESEARCHER.PID": pidAttr,
                        "ARTICLE.doi": doi,
                        position: idx + 1
                    });
                    // Save authors in the researchers array
                    if (!researchers.some(researcher => researcher.PID === pidAttr)) {
                        researchers.push({
                            PID: pidAttr,
                            NOM: lastName,
                            PRENOM: firstName,
                            ORCID: '',
                            SCRAPED: -2
                        });
                    }
                });
            }

            const articleList = record.article || [];
            for (const art of articleList) {
                const key = art.$?.key ?? "";
                let eeText = art.ee?.[0] ?? "";
                if (typeof eeText == "object") {
                    eeText = eeText["_"];
                }
                const doi = eeText.includes("https://doi.org/") ? eeText.replace("https://doi.org/", "") : null;
                const title = art.title?.[0] ?? "";
                const year = art.year?.[0] ?? "";
                const pages = art.pages?.[0] ?? "";
                const venue = art.journal?.[0] ?? "";
                const volume = art.volume?.[0] ?? "";
                const number = art.number?.[0] ?? "";
                papers.push({
                    doi,
                    "TYPE_PUBLICATION.id": 2,
                    titre: title,
                    venue,
                    year,
                    pages,
                    ee: eeText,
                    url_dblp: `https://dblp.org/rec/${key}`
                });
                articles.push({
                    id: articleIdCounter,
                    "PAPER.id": doi,
                    volume,
                    number
                });

                // Contributions from authors
                const authorElems = art.author || [];
                authorElems.forEach((auth: any, idx: number) => {
                    const pidAttr = auth.$?.pid ?? "";
                    const authorName = auth._ ?? "";
                    const [firstName, lastName] = authorName.split(' ');
                    contributions.push({
                        "RESEARCHER.PID": pidAttr,
                        "ARTICLE.doi": doi,
                        position: idx + 1
                    });
                    // Save authors in the researchers array
                    if (!researchers.some(researcher => researcher.PID === pidAttr)) {
                        researchers.push({
                            PID: pidAttr,
                            NOM: lastName,
                            PRENOM: firstName,
                            ORCID: '',
                            SCRAPED: -2
                        });
                    }
                });
                articleIdCounter += 1;
            }
        }

        // Prepare the author data to return
        const firstName = authorName.split(' ')[0];
        const lastName = authorName.split(' ').slice(1).join(' ');

        const author_data = {
            pid,
            last_name: lastName,
            first_name: firstName,
            ORCID: "",
            scraped: 1
        };

        await db.transaction(async (tx) => {
            // tx.rollback();

            // Save researcher data
            console.log("Saving researcher data...");
            for (const researcher of researchers) {
                await createResearcher(researcher.PID, researcher.NOM, researcher.PRENOM, researcher.ORCID, researcher.SCRAPED, tx);
            }

            // Save universities
            console.log("Saving universities...");
            const universityIds: Record<string, number> = {};
            for (const university of universities) {
                universityIds[university.NOM] = (await createUniversity(university.NOM, tx))[0].id;
            }

            // Save affiliations
            console.log("Saving affiliations...");
            for (const affiliation of uniqueAffiliations) {
                const universityId = universityIds[affiliation as string];
                await createAffiliation(pid, universityId, tx);
            }

            // Save papers
            console.log("Saving papers...");
            const paperIds: Record<string, number> = {};
            for (const paper of papers) {
                paperIds[paper.doi] = (await createPaper(paper.doi, paper.titre, paper.venue, paper["TYPE_PUBLICATION.id"], parseInt(paper.year), paper.pages.includes("-") ? parseInt(paper.pages.split('-')[0]) : undefined, paper.pages.includes("-") ? parseInt(paper.pages.split('-')[1]) : undefined, paper.ee, tx))[0].id;
            }

            // Save articles
            console.log("Saving articles...");
            for (const article of articles) {
                await createArticle(paperIds[article["PAPER.id"]], article.number || "", article.volume || "", tx);
            }

            // Save contributions
            console.log("Saving contributions...");
            for (const contribution of contributions) {
                await createContributions(contribution["RESEARCHER.PID"], contribution.position, paperIds[contribution["ARTICLE.doi"]], tx);
            }

            console.log("Data saved successfully!");
        });

        for (const contribution of contributions) {
            const author = await getResearcher(contribution["RESEARCHER.PID"]);
            if (author[0].scraped === -2) {
                scrapeResearcher(contribution["RESEARCHER.PID"]);
            }
        }

        return author_data;
    } catch (error) {
        // Handle errors gracefully
        throw new Error(`Failed to scrape researcher data: ${error}`);
    }
}

export async function searchResearcher(name: string) {
    const data = await db.select()
        .from(researcherTable)
        .where(or(or(
            like(researcherTable.last_name, `%${name}%`),
            like(researcherTable.first_name, `%${name}%`)),
            like(sql`CONCAT(${researcherTable.first_name}, ' ', ${researcherTable.last_name})`, `%${name}%`))
        );

    return data;
}

/*
Donne :
- Les infos du chercheur
- Les infos de ses affiliations
- Les papiers et articles auquel il a participé
    - Les chercheurs ayant participé au papier
    - Le type de publication
*/
export async function getAllInfosResearcher(pid: string, tx?: Transaction) {
    const conn = (tx ? tx : db);

    let researcher = await conn
        .select({
            pid: researcherTable.pid,
            last_name: researcherTable.last_name,
            first_name: researcherTable.first_name,
            ORCID: researcherTable.ORCID,
            scraped: researcherTable.scraped
        })
        .from(researcherTable)
        .where(and(
            eq(researcherTable.pid, pid),
            isNull(researcherTable.deletedAt)
        ));

    if (researcher.length === 0) {
        console.log("Researcher not found");
        researcher = [await scrapeResearcher(pid)];
    } else if (researcher[0].scraped === -2) {
        console.log("Researcher not scraped");
        await scrapeResearcher(pid)
    }

    const universities = await conn
        .select({
            id: universityTable.id,
            name: universityTable.name
        })
        .from(universityTable)
        .innerJoin(affiliationTable, eq(universityTable.id, affiliationTable.universityId))
        .where(and(
            eq(affiliationTable.researcherPid, pid),
            isNull(universityTable.deletedAt),
            isNull(affiliationTable.deletedAt)
        ));

    const papers = await conn
        .select({
            id: paperTable.id,
            doi: paperTable.doi,
            titre: paperTable.titre,
            venue: paperTable.venue,
            year: paperTable.year,
            page_start: paperTable.page_start,
            page_end: paperTable.page_end,
            ee: paperTable.ee,
            dblp: paperTable.dblp_id,
            typePublication: {
                name: typePublicationTable.name,
                abbreviation: typePublicationTable.abbreviation
            }
        })
        .from(paperTable)
        .innerJoin(typePublicationTable, eq(paperTable.typePublicationId, typePublicationTable.id))
        .innerJoin(contributionTable, eq(paperTable.id, contributionTable.paperId))
        .where(and(
            isNull(paperTable.deletedAt),
            isNull(typePublicationTable.deletedAt),
            isNull(contributionTable.deletedAt),
            eq(contributionTable.researcherPid, pid)
        )) as Array<{
            id: number;
            doi: string | null;
            titre: string;
            venue: string | null;
            year: number;
            page_start: number | null;
            page_end: number | null;
            ee: string | null;
            typePublication: { name: string; abbreviation: string };
            authors?: Array<{ pid: string; last_name: string; first_name: string, scraped: number }>;
            article?: { number: string; volume: string };
        }>;

    for (const paper of papers) {
        const authors = await conn
            .select({
                pid: researcherTable.pid,
                last_name: researcherTable.last_name,
                first_name: researcherTable.first_name,
                scraped: researcherTable.scraped
            })
            .from(researcherTable)
            .innerJoin(contributionTable, eq(researcherTable.pid, contributionTable.researcherPid))
            .where(and(
                eq(contributionTable.paperId, paper.id),
                isNull(researcherTable.deletedAt),
                isNull(contributionTable.deletedAt)
            ));

        paper.authors = authors;

        const paperInfo = await conn
            .select({
                id: articleTable.id,
                number: articleTable.number,
                volume: articleTable.volume
            })
            .from(articleTable)
            .where(eq(articleTable.paperId, paper.id));

        if (paperInfo.length > 0) {
            paper.article = paperInfo[0];
        }
    }

    return {
        researcher: researcher[0],
        universities,
        papers
    };

}

export async function getResearcher(pid: string, tx?: Transaction) {
    return await (tx ? tx : db)
        .select()
        .from(researcherTable)
        .where(eq(
            researcherTable.pid,
            pid
        ));
}

export async function getAllResearchers(tx?: Transaction) {
    return await (tx ? tx : db)
        .select()
        .from(researcherTable);
}

export async function updateResearcher(pid: string, last_name?: string, first_name?: string, ORCID?: string, scraped?: number, tx?: Transaction) {
    return await (tx ? tx : db)
        .update(researcherTable)
        .set({
            last_name,
            first_name,
            ORCID,
            scraped
        })
        .where(eq(researcherTable.pid, pid));
}

export async function deleteResearcher(pid: string, tx?: Transaction) {
    return await (tx ? tx : db)
        .update(researcherTable)
        .set({
            deletedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(researcherTable.pid, pid));
}

export async function createUniversity(name: string, tx?: Transaction) {
    return await (tx ? tx : db)
        .insert(universityTable)
        .values({ name } as NewUniversity)
        .returning({ id: universityTable.id });
}

export async function getUniversity(id: number, tx?: Transaction) {
    return await (tx ? tx : db)
        .select()
        .from(universityTable)
        .where(eq(
            universityTable.id,
            id
        ));
}

export async function getUniversitiesByResearcherPid(researcherPid: string, tx?: Transaction) {
    return await (tx ? tx : db)
        .select({
            id: universityTable.id,
            name: universityTable.name,
            createdAt: universityTable.createdAt,
            updatedAt: universityTable.updatedAt,
            deletedAt: universityTable.deletedAt
        })
        .from(universityTable)
        .innerJoin(affiliationTable, eq(universityTable.id, affiliationTable.universityId))
        .where(eq(affiliationTable.researcherPid, researcherPid));
}

export async function updateUniversity(id: number, name?: string, tx?: Transaction) {
    return await (tx ? tx : db)
        .update(universityTable)
        .set({
            name
        })
        .where(eq(universityTable.id, id));
}

export async function deleteUniversity(id: number, tx?: Transaction) {
    return await (tx ? tx : db)
        .update(universityTable)
        .set({
            deletedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(universityTable.id, id));
}

export async function createAffiliation(researcherPid: string, universityId: number, tx?: Transaction) {
    return await (tx ? tx : db)
        .insert(affiliationTable)
        .values({ researcherPid, universityId } as NewAffiliation);
}

export async function getAffiliation(researcherPid: string, universityId: number, tx?: Transaction) {
    return await (tx ? tx : db)
        .select()
        .from(affiliationTable)
        .where(and(
            eq(affiliationTable.researcherPid, researcherPid),
            eq(affiliationTable.universityId, universityId)
        ));
};

export async function getAffiliationByUniversityId(universityId: number, tx?: any) {
    return await (tx ? tx : db)
        .select()
        .from(affiliationTable)
        .where(eq(
            affiliationTable.universityId,
            universityId
        ));
}

export async function deleteAffiliation(researcherPid: string, universityId: number, tx?: Transaction) {
    return await (tx ? tx : db)
        .update(affiliationTable)
        .set({
            deletedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(and(
            eq(affiliationTable.researcherPid, researcherPid),
            eq(affiliationTable.universityId, universityId)
        ));
}

export async function createTypePublication(name: string, tx?: Transaction) {
    return await (tx ? tx : db)
        .insert(typePublicationTable)
        .values({ name } as NewTypePublication);
}

export async function getTypePublication(id: number, tx?: Transaction) {
    return await (tx ? tx : db)
        .select()
        .from(typePublicationTable)
        .where(eq(
            typePublicationTable.id,
            id
        ));
}

export async function updateTypePublication(id: number, name?: string, tx?: Transaction) {
    return await (tx ? tx : db)
        .update(typePublicationTable)
        .set({
            name
        })
        .where(eq(typePublicationTable.id, id));
}

export async function deleteTypePublication(id: number, tx?: Transaction) {
    return await (tx ? tx : db)
        .update(typePublicationTable)
        .set({
            deletedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(typePublicationTable.id, id));
}

export async function createPaper(doi: string, titre: string, venue: string, typePublicationId: number, year: number, page_start?: number, page_end?: number, ee?: string, tx?: Transaction) {
    return await (tx ? tx : db)
        .insert(paperTable)
        .values({ doi, titre, venue, typePublicationId, year, page_start, page_end, ee } as NewPaper)
        .returning({ id: paperTable.id });
}

export async function getPaperFromResearcherPid(researcherPid: string, tx?: Transaction) {
    return await (tx ? tx : db)
        .select()
        .from(paperTable)
        .innerJoin(contributionTable, eq(paperTable.id, contributionTable.paperId))
        .where(eq(contributionTable.researcherPid, researcherPid));
}

export async function getPublicationsByResearcherPid(researcherPid: string, tx?: Transaction) {
    const conn = (tx ? tx : db);

    const papers = await conn
        .select({
            id: paperTable.id,
            doi: paperTable.doi,
            titre: paperTable.titre,
            venue: paperTable.venue,
            year: paperTable.year,
            page_start: paperTable.page_start,
            page_end: paperTable.page_end,
            ee: paperTable.ee,
            dblp: paperTable.dblp_id,
            typePublication: {
                name: typePublicationTable.name,
                abbreviation: typePublicationTable.abbreviation
            }
        })
        .from(paperTable)
        .innerJoin(typePublicationTable, eq(paperTable.typePublicationId, typePublicationTable.id))
        .innerJoin(contributionTable, eq(paperTable.id, contributionTable.paperId))
        .where(and(
            isNull(paperTable.deletedAt),
            isNull(typePublicationTable.deletedAt),
            isNull(contributionTable.deletedAt),
            eq(contributionTable.researcherPid, researcherPid)
        )) as Array<{
            id: number;
            doi: string | null;
            titre: string;
            venue: string | null;
            year: number;
            page_start: number | null;
            page_end: number | null;
            ee: string | null;
            typePublication: { name: string; abbreviation: string };
            authors?: Array<{ pid: string; last_name: string; first_name: string, scraped: number }>;
            article?: { number: string; volume: string };
        }>;

    for (const paper of papers) {
        const authors = await conn
            .select({
                pid: researcherTable.pid,
                last_name: researcherTable.last_name,
                first_name: researcherTable.first_name,
                scraped: researcherTable.scraped
            })
            .from(researcherTable)
            .innerJoin(contributionTable, eq(researcherTable.pid, contributionTable.researcherPid))
            .where(and(
                eq(contributionTable.paperId, paper.id),
                isNull(researcherTable.deletedAt),
                isNull(contributionTable.deletedAt)
            ));

        paper.authors = authors;

        const paperInfo = await conn
            .select({
                id: articleTable.id,
                number: articleTable.number,
                volume: articleTable.volume
            })
            .from(articleTable)
            .where(eq(articleTable.paperId, paper.id));

        if (paperInfo.length > 0) {
            paper.article = paperInfo[0];
        }
    }

    return papers;
}

export async function updatePaper(id: number, doi?: string, titre?: string, venue?: string, typePublicationId?: number, year?: number, page_start?: number, page_end?: number, ee?: string, tx?: Transaction) {
    return await (tx ? tx : db)
        .update(paperTable)
        .set({
            doi,
            titre,
            venue,
            typePublicationId,
            year,
            page_start,
            page_end,
            ee
        })
        .where(eq(paperTable.id, id));
}

export async function deletePaper(id: number, tx?: Transaction) {
    return await (tx ? tx : db)
        .update(paperTable)
        .set({
            deletedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(paperTable.id, id));
}

export async function createArticle(paperId: number, number: string, volume: string, tx?: Transaction) {
    return await (tx ? tx : db)
        .insert(articleTable)
        .values({ paperId, number: number, volume: volume } as NewArticle);
}

export async function getArticle(id: number, tx?: Transaction) {
    return await (tx ? tx : db)
        .select()
        .from(articleTable)
        .where(eq(
            articleTable.id,
            id
        ));
}

export async function deleteArticle(id: number, tx?: Transaction) {
    return await (tx ? tx : db)
        .update(articleTable)
        .set({
            deletedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(articleTable.id, id));
}

export async function createContributions(researcherPid: string, position: number, paperId: number, tx?: Transaction) {
    const alreadyExists = await getContribution(researcherPid, paperId, tx);

    if (alreadyExists.length > 0) {
        return;
    }

    return await (tx ? tx : db)
        .insert(contributionTable)
        .values({ researcherPid, position, paperId } as NewContribution);
}

export async function getContribution(researcherPid: string, paperId: number, tx?: Transaction) {
    return await (tx ? tx : db)
        .select()
        .from(contributionTable)
        .where(and(
            eq(contributionTable.researcherPid, researcherPid),
            eq(contributionTable.paperId, paperId)
        ));
}

export async function deleteContribution(researcherPid: string, position: number, tx?: Transaction) {
    return await (tx ? tx : db)
        .update(contributionTable)
        .set({
            deletedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(and(
            eq(contributionTable.researcherPid, researcherPid),
            eq(contributionTable.position, position)
        ));
}