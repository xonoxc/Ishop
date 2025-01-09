"use client"

import { IProduct } from "@/models/product"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/client/apiclient"
import { RequestStatus } from "@/types/requestStatus"
import ImageGallery from "@/components/ImageGallery"
import { useToast } from "@/hooks/use-toast"

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
                    })
                }
                setProducts(data?.products as IProduct[])
            } catch (error) {
                console.error("error fetching products", error)
            } finally {
                setStatus("idle")
            }
        }

        fetchProducts()
    }, [])

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">ImageKit Shop</h1>
            <div className="flex items-center justify-center w-full">
                {status === "pending" ? (
                    "loading...."
                ) : (
                    <ImageGallery products={products} />
                )}
            </div>
        </main>
    )
}
