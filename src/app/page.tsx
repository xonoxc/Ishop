"use client"

import { IProduct } from "@/models/product"
import { ICategory } from "@/models/category"
import { Suspense, useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/client/apiclient"
import { RequestStatus } from "@/types/requestStatus"
import ImageGallery from "@/components/ImageGallery"
import { useToast } from "@/hooks/use-toast"
import CategorySection from "@/components/CategorySection"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader } from "@/components/Loader"

export default function Home() {
    return (
        <Suspense fallback={<HomeSkeleton />}>
            <Content />
        </Suspense>
    )
}

const Content = () => {
    const [products, setProducts] = useState<IProduct[]>([])
    const [categories, setCategories] = useState<ICategory[]>([])
    const [status, setStatus] = useState<RequestStatus>("pending")
    const { toast } = useToast()
    const searchParams = useSearchParams()
    const categoryId = searchParams.get("categoryId")

    const fetchCategories = useCallback(async () => {
        try {
            const { data, error } = await apiClient.getCategories()
            if (error) {
                throw new Error(error)
            }
            setCategories((data?.categories as ICategory[]) ?? [])
        } catch (error) {
            throw error
        }
    }, [])

    const fetchProducts = useCallback(async () => {
        try {
            if (categoryId) {
                const { data, error } =
                    await apiClient.getProductByCategory(categoryId)
                if (error) {
                    throw new Error(error)
                }
                setProducts((data?.categoryProducts as IProduct[]) ?? [])
            } else {
                const { data, error } = await apiClient.getProducts()

                if (error) {
                    throw new Error(error)
                }

                setProducts((data?.products as IProduct[]) ?? [])
            }
        } catch (error) {
            throw error
        }
    }, [categoryId])

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchCategories()
                await fetchProducts()
                setStatus("idle")
            } catch (error) {
                console.error("Error fetching data:", error)
                toast({
                    title: "Error fetching data",
                    description: "Please try again later.",
                    variant: "destructive",
                })
                setStatus("error")
            }
        }

        fetchData()
    }, [categoryId, toast, fetchProducts, fetchCategories])

    const selectedCategory = categories.find(
        category => category._id.toString() === categoryId
    )

    if (status === "pending") {
        return (
            <div className="flex min-h-screen bg-background flex-col">
                <Loader />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-background flex-col">
            <main className="flex-1 container mx-auto px-4 py-8 transition-all duration-300 ease-in-out">
                <CategorySection categories={categories} />
                <h1 className="text-3xl font-bold mb-8 text-foreground mt-3 mx-0 md:mx-14">
                    {selectedCategory ? selectedCategory.name : "All Images"}
                </h1>
                <div className="w-full px-6">
                    {status === "error" && (
                        <div className="text-center text-red-500">
                            Failed to load products. Please try again later.
                        </div>
                    )}
                    {status === "idle" && <ImageGallery products={products} />}
                </div>
            </main>
        </div>
    )
}

const HomeSkeleton = () => {
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
