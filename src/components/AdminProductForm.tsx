"use client"

import { useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { ImagePlus, Loader2, Plus, Trash2, Upload } from "lucide-react"
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
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AdminProductForm() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
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

    const watchImageUrl = watch("imageUrl")

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
        <div className="min-h-screen bg-background p-6">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-3xl mx-auto space-y-8"
            >
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-semibold tracking-tight flex items-center justify-center gap-2">
                        <ImagePlus />
                        Create New Product
                    </h1>
                    <p className="text-muted-foreground">
                        Add a new product to your store with variants and
                        pricing.
                    </p>
                </div>

                <Card className="border-2 border-dashed">
                    <CardContent className="pt-6">
                        <div className="grid gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-base">
                                        Product Name
                                    </Label>
                                    <Input
                                        id="name"
                                        {...register("name", {
                                            required: "Name is required",
                                        })}
                                        className={`h-12 text-lg ${errors.name ? "border-red-500" : ""}`}
                                        placeholder="Enter product name"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="description"
                                        className="text-base"
                                    >
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        {...register("description", {
                                            required: "Description is required",
                                        })}
                                        className={`min-h-[120px] text-base ${errors.description ? "border-red-500" : ""}`}
                                        placeholder="Enter product description"
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-base">
                                        Product Image
                                    </Label>
                                    <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                                        {!watchImageUrl ? (
                                            <div className="space-y-4">
                                                <div className="mx-auto w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Drag and drop your image
                                                        here, or click to select
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Supported formats: PNG,
                                                        JPG, GIF up to 10MB
                                                    </p>
                                                </div>
                                                <FileUpload
                                                    onSuccessAction={
                                                        handleUploadSuccess
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden">
                                                    <img
                                                        src={watchImageUrl}
                                                        alt="Product preview"
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <FileUpload
                                                    onSuccessAction={
                                                        handleUploadSuccess
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">
                                Image Variants
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Configure size and pricing options for your
                                product.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
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
                    </div>

                    <ScrollArea className="h-[400px]">
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <Card key={field.id} className="relative group">
                                    <CardContent className="pt-6">
                                        <div className="absolute -top-3 -right-3">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => remove(index)}
                                                disabled={fields.length === 1}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="grid gap-6 sm:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`variants.${index}.type`}
                                                    className="text-sm"
                                                >
                                                    Size & Aspect Ratio
                                                </Label>
                                                <Controller
                                                    name={`variants.${index}.type`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            value={field.value}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select size" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Object.entries(
                                                                    IMAGE_VARIANTS
                                                                ).map(
                                                                    ([
                                                                        key,
                                                                        value,
                                                                    ]) => (
                                                                        <SelectItem
                                                                            key={
                                                                                key
                                                                            }
                                                                            value={
                                                                                value.type
                                                                            }
                                                                        >
                                                                            {
                                                                                value.label
                                                                            }{" "}
                                                                            (
                                                                            {
                                                                                value
                                                                                    .dimensions
                                                                                    .width
                                                                            }
                                                                            x
                                                                            {
                                                                                value
                                                                                    .dimensions
                                                                                    .height
                                                                            }
                                                                            )
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`variants.${index}.license`}
                                                    className="text-sm"
                                                >
                                                    License
                                                </Label>
                                                <Controller
                                                    name={`variants.${index}.license`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
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
                                                                    Commercial
                                                                    Use
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`variants.${index}.price`}
                                                    className="text-sm"
                                                >
                                                    Price ($)
                                                </Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    {...register(
                                                        `variants.${index}.price`,
                                                        {
                                                            valueAsNumber: true,
                                                            required:
                                                                "Price is required",
                                                            min: {
                                                                value: 0.01,
                                                                message:
                                                                    "Price must be greater than 0",
                                                            },
                                                        }
                                                    )}
                                                    className={
                                                        errors.variants?.[index]
                                                            ?.price
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                />
                                                {errors.variants?.[index]
                                                    ?.price && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            errors.variants[
                                                                index
                                                            ]?.price?.message
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="min-w-[120px]"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Product"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
