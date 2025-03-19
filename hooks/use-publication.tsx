import useSWR from "swr"
import type { Publication } from "@/lib/db/action"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function usePublication(id: number | null = null) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/publication/?id=${encodeURIComponent(id)}` : null,
    fetcher,
  )

  return {
    publication: data as Publication,
    isLoading,
    isError: error,
  }
}

