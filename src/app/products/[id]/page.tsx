"use client"
import {
    IMAGE_VARIANTS,
    ImageVariant,
    ImageVariantType,
    IProduct,
} from "@/models/product"
import {
    Loader2,
    AlertCircle,
    Check,
    ImageIcon,
    ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/client/apiclient"
import { useSession } from "next-auth/react"
import { IKImage } from "imagekitio-next"
import { useToast } from "@/hooks/use-toast"

export default function ProductPage() {
    const params: { id?: string } = useParams()
    const [product, setProduct] = useState<IProduct | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [selectedVariant, setSelectedVariant] = useState<ImageVariant | null>(
        null
    )

    const { toast } = useToast()
    const router = useRouter()
    const { data: session } = useSession()

    useEffect(() => {
        const fetchProduct = async () => {
            const id = params?.id
            if (!id) {
                setError("Product ID is missing")
                setLoading(false)
                return
            }
            try {
                setLoading(true)
                const { data, error } = await apiClient.getProduct(
                    id.toString()
                )
                if (error) {
                    throw new Error(error)
                }
                if (data) {
                    setProduct(data.product)
                }
            } catch (error) {
                console.error("Error fetching product", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [params?.id])

    const handlePurchase = async (variant: ImageVariant) => {
        if (!session) {
            toast({
                title: "Please sign in to purchase",
                variant: "destructive",
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
                prefil: {
                    email: session.user.email,
                },
            }

            const rzp = new (window as any).Razorpay(options)
            rzp.open()
        } catch (error) {
            console.error(error)
            toast({
                title:
                    error instanceof Error ? error.message : "Payment failed",
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

    if (loading)
        return (
            <div className="min-h-[70vh] flex justify-center items-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        )

    if (error || !product)
        return (
            <div className="alert alert-error max-w-md mx-auto my-8">
                <AlertCircle className="w-6 h-6" />
                <span>{error || "Product not found"}</span>
            </div>
        )

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-4">
                    <Card>
                        <CardContent className="p-4">
                            <div
                                className="relative rounded-lg overflow-hidden"
                                style={{
                                    aspectRatio: selectedVariant
                                        ? `${IMAGE_VARIANTS[selectedVariant.type].dimensions.width} / ${
                                              IMAGE_VARIANTS[
                                                  selectedVariant.type
                                              ].dimensions.height
                                          }`
                                        : "1 / 1",
                                }}
                            >
                                <IKImage
                                    urlEndpoint={
                                        process.env.NEXT_PUBLIC_URL_ENDPOINT
                                    }
                                    path={product.imageUrl}
                                    alt={product.name}
                                    transformation={
                                        selectedVariant
                                            ? getTransformation(
                                                  selectedVariant.type
                                              )
                                            : getTransformation("SQUARE")
                                    }
                                    className="w-full h-full object-cover"
                                    loading="eager"
                                />
                            </div>
                            {selectedVariant && (
                                <div className="text-sm text-center text-muted-foreground mt-2">
                                    Preview:{" "}
                                    {
                                        IMAGE_VARIANTS[selectedVariant.type]
                                            .dimensions.width
                                    }{" "}
                                    x{" "}
                                    {
                                        IMAGE_VARIANTS[selectedVariant.type]
                                            .dimensions.height
                                    }
                                    px
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Product Details Section */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            {product.name}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {product.description}
                        </p>
                    </div>

                    {/* Variants Selection */}
                    <Tabs defaultValue="versions" className="w-full">
                        <TabsList className="rounded-2xl mb-4">
                            <TabsTrigger
                                value="versions"
                                className="rounded-xl"
                            >
                                Versions
                            </TabsTrigger>
                            <TabsTrigger value="license" className="rounded-xl">
                                License Info
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="versions">
                            <div className="space-y-4">
                                {product.variants.map(variant => (
                                    <Card
                                        key={variant.type}
                                        className={`cursor-pointer transition-colors ${
                                            selectedVariant?.type ===
                                            variant.type
                                                ? "ring-2 ring-primary"
                                                : ""
                                        } rounded-2xl`}
                                        onClick={() =>
                                            setSelectedVariant(variant)
                                        }
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <ImageIcon className="w-5 h-5" />
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {
                                                                IMAGE_VARIANTS[
                                                                    variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
                                                                ].label
                                                            }
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                IMAGE_VARIANTS[
                                                                    variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
                                                                ].dimensions
                                                                    .width
                                                            }{" "}
                                                            x{" "}
                                                            {
                                                                IMAGE_VARIANTS[
                                                                    variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
                                                                ].dimensions
                                                                    .height
                                                            }
                                                            px •{" "}
                                                            {variant.license}{" "}
                                                            license
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xl font-bold">
                                                        $
                                                        {variant.price.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        className="rounded-lg"
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            handlePurchase(
                                                                variant
                                                            )
                                                        }}
                                                    >
                                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                                        Buy Now
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="license">
                            <Card>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold mb-2">
                                        License Information
                                    </h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-500" />
                                            <span>
                                                Personal: Use in personal
                                                projects
                                            </span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-500" />
                                            <span>
                                                Commercial: Use in commercial
                                                projects
                                            </span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
