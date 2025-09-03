"use client"

import { IMAGE_VARIANTS } from "@/models/product"
import { IKImage } from "imagekitio-next"
import { Download, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import BackBtn from "@/components/BackBtn"
import useOrdersQueryOptions from "@/hooks/queries/orders"
import { useQuery } from "@tanstack/react-query"

export default function Order() {
    const {
        data: orders,
        isLoading,
        isError,
        error,
    } = useQuery(useOrdersQueryOptions())

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <BackBtn />
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

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-500">
                <BackBtn />
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>
                <p>⚠️ {error.message}</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen text-white">
            <BackBtn />
            <div className="w-full flex items-center justify-start md:justify-center py-4">
                <h1
                    className="
					text-lg md:text-3xl font-bold mb-4 mx-24 
					flex items-center justify-center md:justify-start gap-2 mt-4
					"
                >
                    My Orders
                    <Package className="w-4 h-4 md:w-8 md:h-8" />
                </h1>
            </div>
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
                            className="overflow-hidden rounded-xl border border-zinc-800/60  shadow-md hover:shadow-lg transition"
                        >
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6 w-full">
                                    <div className="flex flex-col md:flex-row gap-6 w-full">
                                        {/* Preview Image */}
                                        <div
                                            className="relative rounded-lg overflow-hidden bg-gray-800 w-full md:w-[200px] max-w-full"
                                            style={{
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
                                        <div className="flex-grow w-full md:w-auto">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div>
                                                    <h2 className="text-lg md:text-xl font-bold mb-2">
                                                        {product.name}
                                                    </h2>
                                                    <div className="space-y-1 text-sm md:text-base text-gray-300">
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
                                                                    order
                                                                        .variant
                                                                        .license
                                                                }
                                                            </span>
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <span>Status:</span>
                                                            <Badge
                                                                className="rounded-sm"
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
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-left md:text-right w-full md:w-auto">
                                                    <p className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
                                                        $
                                                        {order.amount.toFixed(
                                                            2
                                                        )}
                                                    </p>
                                                    {order.status ===
                                                        "completed" && (
                                                        <Button
                                                            asChild
                                                            className="gap-2 w-full md:w-auto"
                                                        >
                                                            <a
                                                                href={`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/tr:q-100,w-${variantDimensions.width},h-${variantDimensions.height},cm-extract,fo-center/${product.imageUrl}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                download={`image-${order._id?.toString().slice(-6)}.jpg`}
                                                            >
                                                                <Download className="w-4 h-4" />
                                                                Download
                                                            </a>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}

                {orders?.length === 0 && (
                    <Card className="border-gray-800">
                        <CardContent className="flex flex-col items-center justify-center py-12">
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
