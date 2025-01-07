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
        <Card className="overflow-hidden transition-all duration-300 mx-4">
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
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 hover:bg-black/20" />
                </div>
            </Link>
            <CardContent className="p-4">
                <Link
                    href={`/products/${product._id}`}
                    className="transition-opacity hover:opacity-80"
                >
                    <h2 className="line-clamp-1 text-lg font-semibold">
                        {product.name}
                    </h2>
                </Link>

                <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
                    {product.description}
                </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4">
                <div className="flex flex-col">
                    <span className="text-lg font-bold">
                        From ${lowestPrice.toFixed(2)}
                    </span>
                    <Badge variant="secondary" className="mt-1">
                        <Tag className="mr-1 h-3 w-3" />
                        {product.variants.length} sizes
                    </Badge>
                </div>

                <Button asChild size="sm">
                    <Link href={`/products/${product._id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Options
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
