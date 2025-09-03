import type { ICategory } from "@/models/category"
import { apiClient } from "@/lib/client/apiclient"

export default function useCategoriesQueryOptions() {
    return {
        queryKey: ["categories"],
        queryFn: async () => {
            const { data, error } = await apiClient.getCategories()
            if (error) throw new Error(error)
            return (data?.categories as ICategory[]) ?? []
        },
    }
}
