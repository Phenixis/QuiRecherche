import useSWR from "swr"
import type { Researcher } from "@/lib/db/schema"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useSearch(query: string | null) {
  const { data, error, isLoading } = useSWR(
    query ? `/api/researcher/search?query=${encodeURIComponent(query)}` : null,
    fetcher,
  )

  return {
    researchers: data as Researcher[],
    isLoading,
    isError: error,
  }
}

