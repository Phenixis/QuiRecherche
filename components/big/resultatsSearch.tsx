"use client"

import { useSearchParams } from "next/navigation"
import { useSearch } from "@/hooks/use-search"
import Link from "next/link"

export default function ResultatsSearch() {
    const params = useSearchParams()
    const query = params.get("query")
    const { researchers, isLoading, isError } = useSearch(query)

    return (
        <div className="max-w-3xl w-full">
            {isLoading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : isError ? (
                <div className="p-4 text-center text-red-500">Error loading results</div>
            ) : researchers && researchers.length > 0 ? (
                <div>
                    {researchers.map((researcher) => (
                        <Link key={researcher.pid} href={`/researcher/${researcher.pid}`}>
                            <div key={researcher.pid} className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                                {researcher.first_name} {researcher.last_name}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : query !== null && (
                <div className="p-4 text-center text-gray-500">No results</div>
            )}
        </div>
    )
}