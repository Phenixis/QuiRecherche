import { Researcher, University } from "@/lib/db/schema";
import { Skeleton } from "@/components/ui/skeleton"

export default function ResearcherInfoDisplay({
    researcher,
    universities
}: {
    researcher?: Researcher,
    universities?: University[]
}) {
    return (
        <>
            {
                researcher === undefined ? (
                    <Skeleton className="w-full h-12" />
                ) : (
                    <h2 className="text-2xl font-bold">
                        Publication de {researcher.first_name + " " + researcher.last_name}
                    </h2>
                )
            }
            {
                researcher === undefined && universities === undefined ? (
                    <Skeleton className="w-full h-12" />
                ) : universities !== undefined && universities.length > 0 && (
                    <h2 className="text-2xl">
                        {universities[0].name}
                    </h2>
                )
            }
        </>
    )
}