import { IKImage } from "imagekitio-next"
import Link from "next/link"
import { IProduct, IMAGE_VARIANTS } from "@/models/product"
import { Eye, Tag } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ProductCard({ product }: { product: IProduct }) {
    const lowestPrice = product.variants.reduce(
        (min, variant) => (variant.price < min ? variant.price : min),
        product.variants[0].price
    )

    return (
        <Card
            className="
                group relative 
                bg-gradient-subtle 
                rounded-lg overflow-hidden 
                border border-border/50 
                transition-all duration-500 
                hover:shadow-card hover:scale-[1.02] 
            "
        >
            {/* Image container */}
            <Link href={`/products/${product._id}`} className="block">
                <div className="relative aspect-square overflow-hidden">
                    <IKImage
                        path={product.imageUrl}
                        alt={product.name}
                        loading="eager"
                        transformation={[
                            {
                                height: IMAGE_VARIANTS.SQUARE.dimensions.height.toString(),
                                width: IMAGE_VARIANTS.SQUARE.dimensions.width.toString(),
                                cropMode: "extract",
                                focus: "center",
                                quality: "80",
                            },
                        ]}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="bg-background/80 backdrop-blur-sm"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Category badge (use first variant count as category-like info) */}
                    <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm rounded-md opacity-80 border border-border/50 border-dashed">
                        {product.variants.length} sizes
                    </Badge>
                </div>
            </Link>

            {/* Content */}
            <CardContent className="p-4 space-y-3">
                <Link
                    href={`/products/${product._id}`}
                    className="transition-opacity hover:opacity-80"
                >
                    <h2 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                    </h2>
                </Link>

                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                    {product.description}
                </p>
            </CardContent>

            {/* Price + Actions */}
            <CardFooter className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">
                        ${lowestPrice.toFixed(2)}
                    </span>
                </div>

                <Button asChild size="sm" className="ml-3 rounded-xl">
                    <Link href={`/products/${product._id}`}>View Options</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
