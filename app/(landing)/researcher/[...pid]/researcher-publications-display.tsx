import Publication from "@/components/publication";
import { Skeleton } from "@/components/ui/skeleton"

export default function ResearcherPublicationsDisplay({
    publications
}: {
    publications?: {
        id: number;
        doi: string | null;
        titre: string;
        venue: string | null;
        year: number;
        page_start: number | null;
        page_end: number | null;
        ee: string | null;
        dblp: string | null;
        typePublication: {
            name: string;
            abbreviation: string;
        };
        authors?: Array<{
            pid: string;
            last_name: string;
            first_name: string;
            scraped: number;
        }>;
        article?: {
            number: string;
            volume: string;
        };
        universities?: Array<{
            id: number;
            name: string
        }>;
    }[]
}) {
    return (
        <section>
            {
                publications === undefined ? (
                    <Skeleton className="w-full h-24" />
                ) : (
                    <div>
                        {
                            publications.map((publication) => (
                                <Publication
                                    key={publication.id}
                                    title={publication.titre}
                                    type={publication.typePublication.abbreviation}
                                    researchers={publication.authors || ["Auteurs introuvables"]}
                                    universities={publication.universities || undefined}
                                    doi={publication.doi || ""}
                                    pages={(publication.page_start != null && publication.page_end != null) ? (publication.page_start + "-" + publication.page_end) : undefined}
                                    acronym={publication.venue || undefined}
                                    dblp={publication.dblp || undefined}
                                    year={publication.year}
                                    ee={publication.ee || ""}
                                />
                            ))
                        }
                    </div>
                )
            }
        </section>
    )
}