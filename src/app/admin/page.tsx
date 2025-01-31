"use client"

import { useState, useEffect } from "react"
import AdminProductForm from "@/components/AdminProductForm"
import { CategoryForm } from "@/components/CategoryForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlignVerticalJustifyCenter } from "lucide-react"
import BackBtn from "@/components/BackBtn"

export default function Admin() {
    const [activeTab, setActiveTab] = useState("products")

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [activeTab])

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="px-4 mb-2">
                    <BackBtn />
                </div>
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <div className="flex justify-center py-4">
                        <TabsList className="grid w-full grid-cols-2 max-w-md  rounded-xl border-2">
                            <TabsTrigger
                                value="products"
                                className="text-sm rounded-xl"
                            >
                                Products
                            </TabsTrigger>
                            <TabsTrigger
                                value="categories"
                                className="text-sm rounded-xl"
                            >
                                Categories
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="products" className="space-y-6">
                        <div className="mx-auto max-w-3xl">
                            <AdminProductForm />
                        </div>
                    </TabsContent>
                    <TabsContent value="categories" className="space-y-6">
                        <h2 className="text-2xl font-bold text-center sm:text-left flex items-center justify-center gap-2">
                            <AlignVerticalJustifyCenter />
                            Create Category
                        </h2>
                        <div className="mx-auto max-w-md">
                            <CategoryForm />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
