import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="relative h-[50vh] overflow-hidden">
        <Skeleton className="absolute inset-0" />
        <div className="relative z-10 flex items-center justify-center h-full text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <Skeleton className="h-16 w-96 mx-auto" />
            <Skeleton className="h-8 w-80 mx-auto" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
        </div>
      </section>

      {/* Controls Skeleton */}
      <section className="py-8 bg-gradient-to-br from-orange-50 to-amber-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <Skeleton className="h-10 w-80" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid Skeleton */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
