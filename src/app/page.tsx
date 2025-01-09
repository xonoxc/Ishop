"use client"

import { IProduct } from "@/models/product"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/client/apiclient"
import { RequestStatus } from "@/types/requestStatus"
import ImageGallery from "@/components/ImageGallery"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/Loader"

export default function Home() {
    const [products, setProducts] = useState<IProduct[]>([])
    const [status, setStatus] = useState<RequestStatus>("pending")
    const { toast } = useToast()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setStatus("pending")
                const { data, error } = await apiClient.getProducts()
                if (error) {
                    toast({
                        title: JSON.parse(error).error,
                        variant: "destructive",
                    })
                    setStatus("error")
                } else {
                    setProducts(data?.products as IProduct[])
                    setStatus("idle")
                }
            } catch (error) {
                console.error("error fetching products", error)
                toast({
                    title: "An error occurred while fetching products",
                    variant: "destructive",
                })
                setStatus("error")
            }
        }

        fetchProducts()
    }, [toast])

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-50">All Images</h1>
            <div className="w-full">
                {status === "pending" ? (
                    <Loader />
                ) : status === "error" ? (
                    <div className="text-center text-red-500">
                        Failed to load products. Please try again later.
                    </div>
                ) : (
                    <ImageGallery products={products} />
                )}
            </div>
        </main>
    )
}
