"use client"

import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/client/apiclient"
import { IOrder } from "@/models/order"
import { IMAGE_VARIANTS } from "@/models/product"
import { IKImage } from "imagekitio-next"
import { Download, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function Order() {
    const [orders, setOrders] = useState<IOrder[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const { data: session } = useSession()
    const { toast } = useToast()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data, error } = await apiClient.getUserOrders()
                if (error) {
                    toast({
                        title: "Something went wrong",
                        description:
                            "Failed to fetch orders. Please try again.",
                        variant: "destructive",
                    })
                }
                setOrders(data?.validOrders as IOrder[])
            } catch (error) {
                console.error("Error while fetching orders", error)
                toast({
                    title: "Error",
                    description:
                        "An unexpected error occurred. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [session, toast])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-white">
                    My Orders
                </h1>
                <div className="space-y-6">
                    {[...Array(3)].map((_, index) => (
                        <Card key={index} className="border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <Skeleton className="w-[200px] h-[200px] rounded-lg" />
                                    <div className="flex-grow space-y-4">
                                        <Skeleton className="h-6 w-1/4" />
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8  min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>
            <div className="space-y-6">
                {orders?.map(order => {
                    const variantDimensions =
                        IMAGE_VARIANTS[
                            order?.variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
                        ].dimensions

                    const product = order?.productId as any

                    return (
                        <Card
                            key={order?._id?.toString()}
                            className="bg-black border-gray-800"
                        >
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Preview Image - Low Quality */}
                                    <div
                                        className="relative rounded-lg overflow-hidden bg-gray-800"
                                        style={{
                                            width: "200px",
                                            aspectRatio: `${variantDimensions.width} / ${variantDimensions.height}`,
                                        }}
                                    >
                                        <IKImage
                                            urlEndpoint={
                                                process.env
                                                    .NEXT_PUBLIC_URL_ENDPOINT
                                            }
                                            path={product.imageUrl}
                                            alt={`Order ${order._id?.toString().slice(-6)}`}
                                            transformation={[
                                                {
                                                    quality: "60",
                                                    width: variantDimensions.width.toString(),
                                                    height: variantDimensions.height.toString(),
                                                    cropMode: "extract",
                                                    focus: "center",
                                                },
                                            ]}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Order Details */}
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-xl font-bold mb-2">
                                                    Order #
                                                    {order._id
                                                        ?.toString()
                                                        .slice(-6)}
                                                </h2>
                                                <div className="space-y-2 text-gray-300">
                                                    <p>
                                                        Resolution:{" "}
                                                        {
                                                            variantDimensions.width
                                                        }{" "}
                                                        x{" "}
                                                        {
                                                            variantDimensions.height
                                                        }
                                                        px
                                                    </p>
                                                    <p>
                                                        License Type:{" "}
                                                        <span className="capitalize">
                                                            {
                                                                order.variant
                                                                    .license
                                                            }
                                                        </span>
                                                    </p>
                                                    <p>
                                                        Status:{" "}
                                                        <Badge
                                                            variant={
                                                                order.status ===
                                                                "completed"
                                                                    ? "default"
                                                                    : order.status ===
                                                                        "failed"
                                                                      ? "destructive"
                                                                      : "secondary"
                                                            }
                                                        >
                                                            {order.status}
                                                        </Badge>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-2xl font-bold mb-4">
                                                    ${order.amount.toFixed(2)}
                                                </p>
                                                {order.status ===
                                                    "completed" && (
                                                    <Button
                                                        asChild
                                                        className="gap-2"
                                                    >
                                                        <a
                                                            href={`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/tr:q-100,w-${variantDimensions.width},h-${variantDimensions.height},cm-extract,fo-center/${product.imageUrl}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download={`image-${order._id?.toString().slice(-6)}.jpg`}
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Download High
                                                            Quality
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}

                {orders?.length === 0 && (
                    <Card className="bg-black border-gray-800">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 text-gray-400 mb-4 animate-spin" />
                            <p className="text-gray-400 text-lg">
                                No orders found
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
