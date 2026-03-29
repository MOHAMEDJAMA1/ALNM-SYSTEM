import { CardSkeleton, Skeleton } from "@/components/ui/skeleton";

export function StaffDashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 mt-2">
        <div className="bg-white border border-[#e5e7eb] rounded-[28px] p-6 h-[400px]">
           <Skeleton className="w-48 h-6 mb-6" />
           <div className="space-y-4">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
           </div>
        </div>
        <div className="space-y-8">
           <Skeleton className="w-full h-[200px] rounded-[24px]" />
           <Skeleton className="w-full h-[300px] rounded-[24px]" />
        </div>
      </div>
    </div>
  )
}
