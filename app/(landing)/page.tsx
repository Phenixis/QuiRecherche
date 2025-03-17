import { getAllInfosResearcher } from "@/lib/db/action"

export default async function HomePage() {
    const result = await getAllInfosResearcher("11/2374");

    return (
        <pre>
            {JSON.stringify(result, null, 2)}
        </pre>
    )
}
