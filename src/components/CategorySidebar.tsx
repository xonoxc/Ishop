"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ICategory } from "@/models/category"

interface CategorySidebarProps {
    categories: ICategory[]
}

export default function CategorySidebar({ categories }: CategorySidebarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentCategoryId = searchParams.get("categoryId")

    const toggleSidebar = () => setIsOpen(!isOpen)

    return (
        <>
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-semibold text-foreground">
                            Categories
                        </h2>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-2">
                            <Link href={pathname} passHref>
                                <Button
                                    variant={
                                        currentCategoryId === null
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    className="w-full justify-start"
                                >
                                    All Categories
                                </Button>
                            </Link>
                            {categories.map(category => (
                                <Link
                                    key={category._id.toString()}
                                    href={`${pathname}?categoryId=${category._id}`}
                                    passHref
                                >
                                    <Button
                                        variant={
                                            currentCategoryId ===
                                            category._id.toString()
                                                ? "secondary"
                                                : "ghost"
                                        }
                                        className="w-full justify-start"
                                    >
                                        {category.name}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
            <Button
                variant="outline"
                size="icon"
                className="fixed bottom-4 left-4 z-50 md:hidden"
                onClick={toggleSidebar}
            >
                {isOpen ? <ChevronLeft /> : <ChevronRight />}
            </Button>
        </>
    )
}
