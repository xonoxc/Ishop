"use client"

import { useSearchParams } from "next/navigation"
import ImageGallery from "@/components/ImageGallery"
import { useToast } from "@/hooks/use-toast"
import CategorySection from "@/components/CategorySection"
import { Loader2 } from "lucide-react"
import { useQueries } from "@tanstack/react-query"
import useCategoriesQueryOptions from "@/hooks/queries/categories"
import { useProductsQueryOptions } from "@/hooks/queries/products"

export default function Home() {
    const { toast } = useToast()
    const searchParams = useSearchParams()
    const categoryId = searchParams.get("categoryId")

    const [
        {
            data: categories = [],
            isLoading: isCategoriesLoading,
            isError: isCategoriesError,
        },
        {
            data: products = [],
            isLoading: isProductsLoading,
            isError: isProductsError,
        },
    ] = useQueries({
        queries: [
            useCategoriesQueryOptions(),
            useProductsQueryOptions(categoryId),
        ],
    })

    if (isCategoriesError || isProductsError) {
        toast({
            title: "Error fetching data",
            description: "Please try again later.",
            variant: "destructive",
        })
    }

    const selectedCategory = categories.find(
        category => category._id.toString() === categoryId
    )

    if (isCategoriesLoading || isProductsLoading) {
        return (
            <div className="min-h-[70vh] flex justify-center items-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
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
                    {(isCategoriesError || isProductsError) && (
                        <div className="text-center text-red-500">
                            Failed to load products. Please try again later.
                        </div>
                    )}
                    <ImageGallery products={products} />
                </div>
            </main>
        </div>
    )
}
