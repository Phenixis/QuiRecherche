import { Skeleton } from "@/components/ui/skeleton"

export default function ResearcherPublicationsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
      </div>
      <div className="flex justify-center">
        <Skeleton className="w-64 h-10" />
      </div>
    </div>
  )
}

