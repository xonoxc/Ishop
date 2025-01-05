"use client"

import { IProduct } from "@/models/product"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/client/apiclient"
import { RequestStatus } from "@/types/requestStatus"
import ImageGallery from "@/components/ImageGallery"

export default function Home() {
    const [products, setProducts] = useState<IProduct[]>([])
    const [status, setStatus] = useState<RequestStatus>("pending")

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await apiClient.getProducts()
                setProducts(data)
            } catch (error) {
                setStatus("error")
                console.error(error)
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
                {status === "error" && <span>Something went wrong</span>}
                {status === "pending" ? (
                    "loading...."
                ) : (
                    <ImageGallery products={products} />
                )}
            </div>
        </main>
    )
}
