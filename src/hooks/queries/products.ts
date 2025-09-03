import { apiClient } from "@/lib/client/apiclient"
import type { IProduct } from "@/models/product"

export default function useSpecificProductQueryOptions(
    params: { id?: string } | undefined
) {
    return {
        queryKey: ["product", params?.id],
        queryFn: async () => {
            const id = params?.id
            if (!id) throw new Error("Product ID is missing")

            const { data, error } = await apiClient.getProduct(id.toString())
            if (error) throw new Error(error)
            return data?.product as IProduct
        },
        enabled: !!params?.id,
        retry: 1,
    }
}

export function useProductsQueryOptions(categoryId: string | null) {
    return {
        queryKey: ["products", categoryId],
        queryFn: async () => {
            if (categoryId) {
                const { data, error } =
                    await apiClient.getProductByCategory(categoryId)
                if (error) throw new Error(error)
                return (data?.categoryProducts as IProduct[]) ?? []
            } else {
                const { data, error } = await apiClient.getProducts()
                if (error) throw new Error(error)
                return (data?.products as IProduct[]) ?? []
            }
        },
        retry: 1,
    }
}
