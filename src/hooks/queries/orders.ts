import { apiClient } from "@/lib/client/apiclient"

export default function useOrdersQueryOptions() {
    return {
        queryKey: ["orders"],
        queryFn: async () => {
            const { data, error } = await apiClient.getUserOrders()
            if (error) throw new Error(error)

            return data?.validOrders ?? []
        },
        staleTime: 1000 * 60,
        retry: 1,
    }
}
