"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ICategory } from "@/models/category"

interface CategorySectionProps {
    categories: ICategory[]
}

export default function CategorySection({ categories }: CategorySectionProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentCategoryId = searchParams.get("categoryId")

    return (
        <div className="w-full py-3 sticky top-0 z-10 mx-0 md:mx-10">
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-2 px-4">
                    <Link href={pathname} passHref>
                        <Button
                            variant="ghost"
                            className={`rounded-xl text-sm font-medium ${
                                currentCategoryId === null
                                    ? "bg-white text-black"
                                    : "bg-[#272727] text-white hover:bg-[#3f3f3f]"
                            }`}
                        >
                            All
                        </Button>
                    </Link>
                    {categories.map(category => (
                        <Link
                            key={category._id.toString()}
                            href={`${pathname}?categoryId=${category._id}`}
                            passHref
                        >
                            <Button
                                variant="ghost"
                                className={`rounded-xl text-sm font-medium ${
                                    currentCategoryId ===
                                    category._id.toString()
                                        ? "bg-white text-black"
                                        : "bg-[#272727] text-white hover:bg-[#3f3f3f]"
                                }`}
                            >
                                {category.name}
                            </Button>
                        </Link>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="bg-[#272727]" />
            </ScrollArea>
        </div>
    )
}
