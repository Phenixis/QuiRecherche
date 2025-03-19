"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import ResearcherPublicationsDisplay from "./researcher-publications-display"
import ResearcherPublicationsSkeleton from "./researcher-publications-skeleton"

// Define the publication type
type Publication = {
  id: number
  doi: string | null
  titre: string
  venue: string | null
  year: number
  page_start: number | null
  page_end: number | null
  ee: string | null
  dblp: string | null
  typePublication: {
    name: string
    abbreviation: string
  }
  authors?: Array<{
    pid: string
    last_name: string
    first_name: string
    scraped: number
  }>
  article?: {
    number: string
    volume: string
  }
  universities?: Array<{
    id: number
    name: string
  }>
}

// Define the data structure
type PublicationsData = {
  publications: Publication[]
  totalCount: number
}

export default function ResearcherPublicationsClient({
  initialData,
  pid,
}: {
  initialData: PublicationsData | undefined
  pid: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get current page from URL or default to 1
  const currentPageParam = searchParams.get("page")
  const [currentPage, setCurrentPage] = useState(currentPageParam ? Number.parseInt(currentPageParam) : 1)

  // State for publications data
  const [data, setData] = useState<PublicationsData | undefined>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cache for storing fetched pages
  const [cache, setCache] = useState<Record<number, Publication[]>>(initialData ? { 1: initialData.publications } : {})

  const limit = 10
  const totalPages = data ? Math.ceil(data.totalCount / limit) : 0

  // If initialData is undefined, fetch it
  useEffect(() => {
    if (!initialData && !isLoading && !data) {
      fetchPageData(currentPage)
    }
  }, [initialData, isLoading, data, currentPage])

  // Update URL when page changes without full reload
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", currentPage.toString())

    // Update URL without triggering navigation
    window.history.pushState({}, "", `${pathname}?${params.toString()}`)
  }, [currentPage, pathname, searchParams])

  // Fetch data for a specific page
  const fetchPageData = async (page: number) => {
    // If we already have this page in cache, use it
    if (cache[page]) {
      setData((prev) =>
        prev
          ? {
              ...prev,
              publications: cache[page],
            }
          : undefined,
      )
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Pass pid as a query parameter instead of in the URL path
      const encodedPid = encodeURIComponent(pid)

      // Fetch data from API route
      const response = await fetch(`/api/researcher/publications?pid=${encodedPid}&page=${page}&limit=${limit}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newData = await response.json()

      // Update data and cache
      setData(newData)
      setCache((prev) => ({
        ...prev,
        [page]: newData.publications,
      }))
    } catch (error) {
      console.error("Error fetching publications:", error)
      setError("Impossible de charger les publications. Veuillez réessayer plus tard.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchPageData(page)
  }

  // Prefetch next page
  useEffect(() => {
    if (data && currentPage < totalPages && !cache[currentPage + 1]) {
      const prefetchNextPage = async () => {
        try {
          const encodedPid = encodeURIComponent(pid)
          const response = await fetch(`/api/researcher/publications?pid=${encodedPid}&page=${currentPage + 1}&limit=${limit}`)

          if (!response.ok) {
            return
          }

          const nextPageData = await response.json()

          setCache((prev) => ({
            ...prev,
            [currentPage + 1]: nextPageData.publications,
          }))
        } catch (error) {
          // Silently fail on prefetch errors
          console.error("Error prefetching next page:", error)
        }
      }

      prefetchNextPage()
    }
  }, [currentPage, totalPages, pid, cache, data])

  // If we're loading or don't have data yet, show skeleton
  if (isLoading || !data) {
    return <ResearcherPublicationsSkeleton />
  }

  // If there's an error, show error message
  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
        <p>{error}</p>
        <button
          onClick={() => fetchPageData(currentPage)}
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md text-red-800 text-sm"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <ResearcherPublicationsDisplay
      publications={data.publications}
      totalCount={data.totalCount}
      currentPage={currentPage}
      limit={limit}
      onPageChange={handlePageChange}
    />
  )
}

