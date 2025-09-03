import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { apiClient } from "@/lib/client/apiclient"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

import {
    IMAGE_VARIANTS,
    type ImageVariant,
    type ImageVariantType,
} from "@/models/product"
import useSpecificProductQueryOptions from "../products"
import { useQuery } from "@tanstack/react-query"

export default function useProductPageState() {
    const params: { id?: string } = useParams()
    const [selectedVariant, setSelectedVariant] = useState<ImageVariant | null>(
        null
    )

    const { toast } = useToast()
    const router = useRouter()
    const { data: session } = useSession()

    const {
        data: product,
        isLoading,
        isError,
        error,
    } = useQuery(useSpecificProductQueryOptions(params))

    const handlePurchase = async (variant: ImageVariant) => {
        if (!session) {
            toast({
                title: "Please sign in to purchase",
            })
            router.push("/login")
            return
        }

        if (!product?._id) {
            toast({ title: "Invalid product", variant: "destructive" })
            return
        }

        try {
            const { orderId, amount } = await apiClient.createOrder({
                productId: product._id,
                variant,
            })

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount,
                currency: "USD",
                name: "Imagekit shop",
                description: `${product.name} - ${variant.type} Version`,
                order_id: orderId,
                handler: function () {
                    toast({ title: "Payment successful" })
                    router.push("/orders")
                },
                prefill: {
                    email: session.user.email,
                },
            }

            const rzp = new (window as any).Razorpay(options)
            rzp.open()
        } catch (err) {
            console.error(err)
            toast({
                title: err instanceof Error ? err.message : "Payment failed",
                variant: "destructive",
            })
        }
    }

    const getTransformation = (variantType: ImageVariantType) => {
        const variant = IMAGE_VARIANTS[variantType]
        return [
            {
                width: variant.dimensions.width.toString(),
                height: variant.dimensions.height.toString(),
                cropMode: "extract",
                focus: "center",
                quality: "60",
            },
        ]
    }

    return {
        product,
        isLoading,
        isError,
        error,
        selectedVariant,
        setSelectedVariant,
        handlePurchase,
        getTransformation,
    }
}
