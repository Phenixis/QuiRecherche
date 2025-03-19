"use client"

import Publication from "@/components/publication"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function ResearcherPublicationsDisplay({
  publications,
  totalCount = 0,
  currentPage = 1,
  limit = 10,
  pid,
}: {
  publications?: {
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
  }[]
  totalCount?: number
  currentPage?: number
  limit?: number
  pid?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Create a new URLSearchParams instance to modify
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams],
  )

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit)

  // Function to navigate to a specific page
  const goToPage = (page: number) => {
    router.push(`${pathname}?${createQueryString("page", page.toString())}`)
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of page range around current page
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push("ellipsis-start")
      }

      // Add pages in range
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end")
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <section className="space-y-6">
      {publications === undefined ? (
        <Skeleton className="w-full h-24" />
      ) : (
        <>
          <div>
            {publications.length > 0 ? (
              publications.map((publication) => (
                <Publication
                  key={publication.id}
                  title={publication.titre}
                  type={publication.typePublication.abbreviation}
                  researchers={publication.authors || ["Auteurs introuvables"]}
                  universities={publication.universities || undefined}
                  doi={publication.doi || ""}
                  pages={
                    publication.page_start != null && publication.page_end != null
                      ? publication.page_start + "-" + publication.page_end
                      : undefined
                  }
                  acronym={publication.venue || undefined}
                  dblp={publication.dblp || undefined}
                  year={publication.year}
                  ee={publication.ee || ""}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucune publication trouvée</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) =>
                  typeof page === "number" ? (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => goToPage(page)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={index}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </section>
  )
}

