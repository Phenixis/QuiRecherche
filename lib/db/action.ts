import { db } from "./drizzle";
import { researcher, university, affiliation, typePublication, paper, article, contribution, NewResearcher, NewUniversity, NewAffiliation, NewTypePublication, NewPaper, NewArticle, NewContribution } from "./schema";
import { and, eq, sql } from 'drizzle-orm';
import { PgTransaction } from "drizzle-orm/pg-core";
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

export function createResearcher(pid: string, last_name: string, first_name: string, ORCID: string, scraped: number, tx?: any) {
    return (tx ? tx : db).insert(researcher).values({ pid, last_name, first_name, ORCID, scraped } as NewResearcher);
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
            // No <person> element found, replicating Python's early exit
            return {
                pid,
                authorName,
                affiliations: [],
                affiliatedWithIrisa: -1,
                universities: [],
                univMap: {},
                urls: [],
                papers: [],
                articles: [],
                contributions: []
            };
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
            return {
                pid,
                authorName,
                affiliations: uniqueAffiliations,
                affiliatedWithIrisa,
                universities: [],
                univMap: {},
                urls: [],
                papers: [],
                articles: [],
                contributions: []
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
                NOM: authorName.split(' ')[1],
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
        const [firstName, lastName] = authorName.split(' ');

        const author_data = {
            pid,
            lastName,
            firstName,
            ORCID: "",
            scraped: 1
        };

    db.transaction(async (tx) => {

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

    return author_data;
} catch (error) {
    // Handle errors gracefully
    throw new Error(`Failed to scrape researcher data: ${error}`);
}
}

export function getResearcher(pid: string, tx?: any) {
    return (tx ? tx : db).select().from(researcher).where(eq(
        researcher.pid,
        pid
    ));
}

export function updateResearcher(pid: string, last_name?: string, first_name?: string, ORCID?: string, scraped?: number, tx?: any) {
    return (tx ? tx : db).update(researcher).set({
        last_name,
        first_name,
        ORCID,
        scraped
    }).where(eq(researcher.pid, pid));
}

export function deleteResearcher(pid: string, tx?: any) {
    return (tx ? tx : db).update(researcher).set({
        deletedAt: sql`CURRENT_TIMESTAMP`,
    }).where(eq(researcher.pid, pid));
}

export function createUniversity(name: string, tx?: any) {
    return (tx ? tx : db).insert(university).values({ name } as NewUniversity).returning({ id: university.id });
}

export function getUniversity(id: number, tx?: any) {
    return (tx ? tx : db).select().from(university).where(eq(
        university.id,
        id
    ));
}

export function updateUniversity(id: number, name?: string, tx?: any) {
    return (tx ? tx : db).update(university).set({
        name
    }).where(eq(university.id, id));
}

export function deleteUniversity(id: number, tx?: any) {
    return (tx ? tx : db).update(university).set({
        deletedAt: sql`CURRENT_TIMESTAMP`,
    }).where(eq(university.id, id));
}

export function createAffiliation(researcherPid: string, universityId: number, tx?: any) {
    return (tx ? tx : db).insert(affiliation).values({ researcherPid, universityId } as NewAffiliation);
}

export function getAffiliation(researcherPid: string, universityId: number, tx?: any) {
    return (tx ? tx : db).select().from(affiliation).where(and(
        eq(affiliation.researcherPid, researcherPid),
        eq(affiliation.universityId, universityId)
    ));
};

export function deleteAffiliation(researcherPid: string, universityId: number, tx?: any) {
    return (tx ? tx : db).update(affiliation).set({
        deletedAt: sql`CURRENT_TIMESTAMP`,
    }).where(and(
        eq(affiliation.researcherPid, researcherPid),
        eq(affiliation.universityId, universityId)
    ));
}

export function createTypePublication(name: string, tx?: any) {
    return (tx ? tx : db).insert(typePublication).values({ name } as NewTypePublication);
}

export function getTypePublication(id: number, tx?: any) {
    return (tx ? tx : db).select().from(typePublication).where(eq(
        typePublication.id,
        id
    ));
}

export function updateTypePublication(id: number, name?: string, tx?: any) {
    return (tx ? tx : db).update(typePublication).set({
        name
    }).where(eq(typePublication.id, id));
}

export function deleteTypePublication(id: number, tx?: any) {
    return (tx ? tx : db).update(typePublication).set({
        deletedAt: sql`CURRENT_TIMESTAMP`,
    }).where(eq(typePublication.id, id));
}

export function createPaper(doi: string, titre: string, venue: string, typePublicationId: number, year: number, page_start?: number, page_end?: number, ee?: string, tx?: any) {
    return (tx ? tx : db).insert(paper).values({ doi, titre, venue, typePublicationId, year, page_start, page_end, ee } as NewPaper).returning({ id: paper.id });
}

export function updatePaper(id: number, doi?: string, titre?: string, venue?: string, typePublicationId?: number, year?: number, page_start?: number, page_end?: number, ee?: string, tx?: any) {
    return (tx ? tx : db).update(paper).set({
        doi,
        titre,
        venue,
        typePublicationId,
        year,
        page_start,
        page_end,
        ee
    }).where(eq(paper.id, id));
}

export function deletePaper(id: number, tx?: any) {
    return (tx ? tx : db).update(paper).set({
        deletedAt: sql`CURRENT_TIMESTAMP`,
    }).where(eq(paper.id, id));
}

export function createArticle(paperId: number, number: string, volume: string, tx?: any) {
    return (tx ? tx : db).insert(article).values({ paperId, number: number, volume: volume } as NewArticle);
}

export function getArticle(id: number, tx?: any) {
    return (tx ? tx : db).select().from(article).where(eq(
        article.id,
        id
    ));
}

export function deleteArticle(id: number, tx?: any) {
    return (tx ? tx : db).update(article).set({
        deletedAt: sql`CURRENT_TIMESTAMP`,
    }).where(eq(article.id, id));
}

export function createContributions(researcherPid: string, position: number, paperId: number, tx?: any) {
    return (tx ? tx : db).insert(contribution).values({ researcherPid, position, paperId } as NewContribution);
}

export function getContribution(researcherPid: string, position: number, tx?: any) {
    return (tx ? tx : db).select().from(contribution).where(and(
        eq(contribution.researcherPid, researcherPid),
        eq(contribution.position, position)
    ));
}

export function deleteContribution(researcherPid: string, position: number, tx?: any) {
    return (tx ? tx : db).update(contribution).set({
        deletedAt: sql`CURRENT_TIMESTAMP`,
    }).where(and(
        eq(contribution.researcherPid, researcherPid),
        eq(contribution.position, position)
    ));
}

