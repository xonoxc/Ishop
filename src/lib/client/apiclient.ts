import { IOrder } from "@/models/order"
import { ImageVariant, IProduct } from "@/models/product"
import { Types } from "mongoose"

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE"
    body?: any
    headers?: Record<string, string>
}

export interface CreateOrderData {
    productId: Types.ObjectId | string
    variant: ImageVariant
}

export type ProductFormData = Omit<IProduct, "_id">

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        const { method = "GET", body, headers } = options

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers,
        }

        const response = await fetch(endpoint, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers: defaultHeaders,
        })
        if (!response.ok) {
            throw new Error(await response.text())
        }

        return response.json()
    }

    async getProducts() {
        return this.fetch<IProduct[]>("/api/products")
    }

    async getProduct(id: string) {
        return this.fetch<IProduct>(`/api/products/${id}`)
    }

    async createProduct(productData: ProductFormData) {
        return this.fetch<IProduct>("/api/products", {
            method: "POST",
            body: productData,
        })
    }

    async getUserOrders() {
        return this.fetch<IOrder[]>("/orders/user")
    }

    async createOrder(orderData: CreateOrderData) {
        const sanitizedOrderData = {
            ...orderData,
            productId: orderData.productId.toString(),
        }

        return this.fetch<{ orderId: string; amount: number }>("/orders", {
            method: "POST",
            body: sanitizedOrderData,
        })
    }
}

export const apiClient = new ApiClient()
