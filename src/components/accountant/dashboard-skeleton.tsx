import { CardSkeleton, Skeleton } from "@/components/ui/skeleton";

export function AccountantDashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-[28px] p-6 h-[500px]">
           <Skeleton className="w-48 h-6 mb-6" />
           <div className="space-y-4">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
           </div>
        </div>
        <div className="space-y-6">
           <Skeleton className="w-full h-[300px] rounded-[28px]" />
           <Skeleton className="w-full h-[150px] rounded-[28px]" />
           <Skeleton className="w-full h-[120px] rounded-[28px]" />
        </div>
      </div>
    </div>
  )
}
