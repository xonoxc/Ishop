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
    ): Promise<{ data?: T; error?: string }> {
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
            return {
                error: await response.text(),
            }
        }

        return {
            data: await response.json(),
        }
    }

    async getProducts() {
        return this.fetch<{ products: IProduct[] }>("/api/products")
    }

    async getProduct(id: string) {
        return this.fetch<{ product: IProduct }>(`/api/products/${id}`)
    }

    async createProduct(productData: ProductFormData) {
        const { error } = await this.fetch<IProduct>("/api/products", {
            method: "POST",
            body: productData,
        })

        if (error) {
            throw new Error(error)
        }
    }

    async getUserOrders() {
        return this.fetch<{ validOrders: IOrder[] }>("/api/orders/user")
    }

    async createOrder(orderData: CreateOrderData) {
        const sanitizedOrderData = {
            ...orderData,
            productId: orderData.productId.toString(),
        }

        const { data, error } = await this.fetch<{
            orderId: string
            amount: number
        }>("/orders", {
            method: "POST",
            body: sanitizedOrderData,
        })

        if (error) {
            throw new Error(error)
        }

        return data as {
            orderId: string
            amount: number
        }
    }
}

export const apiClient = new ApiClient()
