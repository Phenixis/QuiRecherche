import useSWR from "swr"
import type { Researcher } from "@/lib/db/schema"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useSearch(query: string | null) {
  const { data, error, isLoading } = useSWR(
    query ? `/api/researcher/search?query=${encodeURIComponent(query)}` : null,
    fetcher,
  )

  return {
    researchers: data as {
      pid: string,
      first_name: string,
      last_name: string,
      nb_articles: number,
    }[],
    isLoading,
    isError: error,
  }
}

