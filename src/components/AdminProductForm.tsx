"use client"

import { useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props"
import { IMAGE_VARIANTS, ImageVariantType } from "@/models/product"
import { apiClient, ProductFormData } from "@/lib/client/apiclient"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import FileUpload from "./FileUpload"

export default function AdminProductForm() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProductFormData>({
        defaultValues: {
            name: "",
            description: "",
            imageUrl: "",
            variants: [
                {
                    type: "SQUARE" as ImageVariantType,
                    price: 9.99,
                    license: "personal",
                },
            ],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants",
    })

    const handleUploadSuccess = (response: IKUploadResponse) => {
        setValue("imageUrl", response.filePath)
        toast({
            title: "Success",
            description: "Image uploaded successfully!",
        })
    }

    const onSubmit = async (data: ProductFormData) => {
        setLoading(true)
        try {
            await apiClient.createProduct(data)
            toast({
                title: "Success",
                description: "Product created successfully!",
            })

            setValue("name", "")
            setValue("description", "")
            setValue("imageUrl", "")
            setValue("variants", [
                {
                    type: "SQUARE" as ImageVariantType,
                    price: 9.99,
                    license: "personal",
                },
            ])
        } catch (error) {
            toast({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to create product",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                {...register("name", {
                                    required: "Name is required",
                                })}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                {...register("description", {
                                    required: "Description is required",
                                })}
                                className={`h-32 ${errors.description ? "border-red-500" : ""}`}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Product Image</Label>
                            <FileUpload onSuccessAction={handleUploadSuccess} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
                Image Variants
            </h2>

            {fields.map((field, index) => (
                <Card key={field.id} className="bg-gray-900">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor={`variants.${index}.type`}>
                                    Size & Aspect Ratio
                                </Label>
                                <Controller
                                    name={`variants.${index}.type`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select size" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(
                                                    IMAGE_VARIANTS
                                                ).map(([key, value]) => (
                                                    <SelectItem
                                                        key={key}
                                                        value={value.type}
                                                    >
                                                        {value.label} (
                                                        {value.dimensions.width}
                                                        x
                                                        {
                                                            value.dimensions
                                                                .height
                                                        }
                                                        )
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`variants.${index}.license`}>
                                    License
                                </Label>
                                <Controller
                                    name={`variants.${index}.license`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select license" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="personal">
                                                    Personal Use
                                                </SelectItem>
                                                <SelectItem value="commercial">
                                                    Commercial Use
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`variants.${index}.price`}>
                                    Price ($)
                                </Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    {...register(`variants.${index}.price`, {
                                        valueAsNumber: true,
                                        required: "Price is required",
                                        min: {
                                            value: 0.01,
                                            message:
                                                "Price must be greater than 0",
                                        },
                                    })}
                                    className={
                                        errors.variants?.[index]?.price
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {errors.variants?.[index]?.price && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.variants[index]?.price?.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="mt-4"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Variant
                        </Button>
                    </CardContent>
                </Card>
            ))}

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                    append({
                        type: "SQUARE" as ImageVariantType,
                        price: 9.99,
                        license: "personal",
                    })
                }
            >
                <Plus className="w-4 h-4 mr-2" />
                Add Variant
            </Button>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Product...
                    </>
                ) : (
                    "Create Product"
                )}
            </Button>
        </form>
    )
}
