"use client"

import { IProduct } from "@/models/product"
import { ICategory } from "@/models/category"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/client/apiclient"
import { RequestStatus } from "@/types/requestStatus"
import ImageGallery from "@/components/ImageGallery"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/Loader"
import CategorySidebar from "@/components/CategorySidebar"

export default function Home() {
    const [products, setProducts] = useState<IProduct[]>([])
    const [categories, setCategories] = useState<ICategory[]>([])
    const [status, setStatus] = useState<RequestStatus>("pending")
    const { toast } = useToast()
    const searchParams = useSearchParams()
    const categoryId = searchParams.get("categoryId")

    const fetchCategories = async () => {
        try {
            const { data, error } = await apiClient.getCategories()
            if (error) {
                throw new Error(error)
            }
            setCategories((data?.categories as ICategory[]) ?? [])
        } catch (error) {
            throw error
        }
    }

    const fetchProducts = async () => {
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
    }

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
    }, [categoryId, toast])

    const selectedCategory = categories.find(
        category => category._id.toString() === categoryId
    )

    return (
        <div className="flex min-h-screen bg-background">
            <CategorySidebar categories={categories} />
            <main className="flex-1 container mx-auto px-4 py-8 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
                <h1 className="text-3xl font-bold mb-8 text-foreground">
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
