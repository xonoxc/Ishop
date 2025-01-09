import { useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/client/apiclient"

interface CategoryFormData {
    name: string
}

export function CategoryForm() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategoryFormData>()

    const onSubmit = async (data: CategoryFormData) => {
        setLoading(true)
        try {
            await apiClient.createCategory(data.name)
            toast({
                title: "Success",
                description: "Category created successfully!",
            })
            reset()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create category",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                    id="name"
                    {...register("name", {
                        required: "Category name is required",
                    })}
                    className={`${errors.name ? "border-red-500" : ""} rounded-xl`}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">
                        {errors.name.message}
                    </p>
                )}
            </div>
            <Button type="submit" disabled={loading} className="rounded-xl">
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                    </>
                ) : (
                    <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Category
                    </>
                )}
            </Button>
        </form>
    )
}
