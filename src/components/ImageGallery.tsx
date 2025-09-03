import { IProduct } from "@/models/product"
import ProductCard from "./ProductCard"

interface ImageGalleryProps {
    products: IProduct[]
}

export default function ImageGallery({ products }: ImageGalleryProps) {
    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products?.map(product => (
                    <ProductCard
                        key={product?._id?.toString()}
                        product={product}
                    />
                ))}

                {products?.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground text-lg">
                            No products found
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
