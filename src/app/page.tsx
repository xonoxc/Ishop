"use client"

import { IProduct } from "@/models/product"
import { ICategory } from "@/models/category"
import { Suspense, useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/client/apiclient"
import { RequestStatus } from "@/types/requestStatus"
import ImageGallery from "@/components/ImageGallery"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/Loader"
import CategorySection from "@/components/CategorySection"
import { Skeleton } from "@/components/ui/skeleton"

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
            setStatus("pending")
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

    return (
        <div className="flex min-h-screen bg-background flex-col">
            <main className="flex-1 container mx-auto px-4 py-8 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
                <CategorySection categories={categories} />
                <h1 className="text-3xl font-bold mb-8 text-foreground mt-3 ml-4">
                    {selectedCategory ? selectedCategory.name : "All Images"}
                </h1>
                <div className="w-full">
                    {status === "pending" && <Loader />}
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
            <main className="flex-1 container mx-auto px-4 py-8 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
                <div className="flex space-x-4 mb-8 overflow-x-auto">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="w-32 h-10 rounded-full" />
                    ))}
                </div>

                <Skeleton className="h-10 w-64 mb-8" />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(12)].map((_, i) => (
                        <Skeleton
                            key={i}
                            className="w-full aspect-square rounded-lg"
                        />
                    ))}
                </div>
            </main>
        </div>
    )
}
