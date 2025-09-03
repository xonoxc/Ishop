import { Skeleton } from "@/components/ui/skeleton"

export default function HomeSkeleton() {
    return (
        <div className="flex min-h-screen bg-background flex-col">
            <main className="flex-1 container mx-auto px-4 py-8 transition-all duration-300 ease-in-out">
                {/* Category Section Skeleton */}
                <div className="flex space-x-2 mb-8 overflow-x-auto">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton
                            key={i}
                            className="w-32 h-10 rounded-2xl flex-shrink-0"
                        />
                    ))}
                </div>

                {/* Title Skeleton */}
                <Skeleton className="h-10 w-64 mb-8 mt-3 mx-0 md:mx-14 rounded-xl" />

                {/* Image Gallery Skeleton */}
                <div className="w-full px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="w-full aspect-[9/12] rounded-xl"
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
