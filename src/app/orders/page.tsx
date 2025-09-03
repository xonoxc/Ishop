"use client"

import { IMAGE_VARIANTS } from "@/models/product"
import { IKImage } from "imagekitio-next"
import { Package, Grid, List } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import BackBtn from "@/components/BackBtn"
import useOrdersQueryOptions from "@/hooks/queries/orders"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Order() {
    const {
        data: orders,
        isLoading,
        isError,
        error,
    } = useQuery(useOrdersQueryOptions())

    const router = useRouter()

    const [view, setView] = useState<"grid" | "list">("list")

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
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
                <h1 className="text-lg md:text-3xl font-bold flex items-center gap-2">
                    My Orders
                    <Package className="w-4 h-4 md:w-7 md:h-7" />
                </h1>
                <div className="flex items-center gap-2">
                    <Button
                        variant={view === "list" ? "default" : "secondary"}
                        size="sm"
                        onClick={() => setView("list")}
                        className="gap-1 rounded-xl"
                    >
                        <List className="w-4 h-4" strokeWidth={2} />
                        List
                    </Button>
                    <Button
                        variant={view === "grid" ? "default" : "secondary"}
                        size="sm"
                        onClick={() => setView("grid")}
                        className="gap-1 rounded-xl"
                    >
                        <Grid className="w-4 h-4" strokeWidth={2} />
                        Grid
                    </Button>
                </div>
            </div>

            {/* Orders */}
            <div
                className={
                    view === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-6"
                }
            >
                {orders?.map(order => {
                    const variantDimensions =
                        IMAGE_VARIANTS[
                            order?.variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
                        ].dimensions

                    const product = order?.productId as any

                    return (
                        <Card
                            key={order?._id?.toString()}
                            className="overflow-hidden rounded-xl border border-zinc-800/60 shadow-md hover:shadow-lg transition"
                            onClick={() =>
                                router.push(`/products/${order.productId._id}`)
                            }
                        >
                            <CardContent className="p-0">
                                {view === "grid" ? (
                                    <div className="flex flex-col">
                                        {/* Image on top */}
                                        <div
                                            className="relative w-full bg-gray-800"
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
                                                        quality: "70",
                                                        width: "600",
                                                        height: "400",
                                                        cropMode: "extract",
                                                        focus: "center",
                                                    },
                                                ]}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* Details under image */}
                                        <div className="p-4 flex flex-col gap-2">
                                            <h2 className="text-lg font-bold">
                                                {product.name}
                                            </h2>
                                            <p className="text-sm text-gray-400">
                                                Resolution:{" "}
                                                {variantDimensions.width}x
                                                {variantDimensions.height}px
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                License Type:{" "}
                                                <span className="capitalize">
                                                    {order.variant.license}
                                                </span>
                                            </p>
                                            <div className="flex justify-between items-center mt-2">
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
                                                <p className="text-lg font-bold">
                                                    ${order.amount.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row gap-6 p-6">
                                        {/* Image left */}
                                        <div
                                            className="relative rounded-lg overflow-hidden bg-gray-800 w-full md:w-[200px]"
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
                                            />
                                        </div>

                                        {/* Details right */}
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div>
                                                <h2 className="text-xl font-bold mb-2">
                                                    {product.name}
                                                </h2>
                                                <p className="text-sm text-gray-400">
                                                    Resolution:{" "}
                                                    {variantDimensions.width}x
                                                    {variantDimensions.height}px
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    License Type:{" "}
                                                    <span className="capitalize">
                                                        {order.variant.license}
                                                    </span>
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span>Status:</span>
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
                                                </div>
                                            </div>
                                            <div className="mt-4 text-xl font-bold">
                                                ${order.amount.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
