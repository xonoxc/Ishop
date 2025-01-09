import { categoryNameSchema } from "@/lib/validation/catergory"
import { NextRequest, NextResponse } from "next/server"
import Product from "@/models/product"
import { isValidObjectId } from "mongoose"

export async function POST(req: NextRequest) {
    try {
        const { categoryId }: { categoryId: string } = await req.json()

        if (categoryId.trim() === "") {
            return NextResponse.json(
                {
                    error: "categoryId is required",
                },
                { status: 400 }
            )
        }

        if (!isValidObjectId(categoryId)) {
            return NextResponse.json(
                {
                    error: "Invalid Category Id",
                },
                { status: 400 }
            )
        }

        const categoryProducts = await Product.find({ categoryId })
        if (categoryProducts.length === 0) {
            return NextResponse.json(
                { message: "No producs found" },
                { status: 200 }
            )
        }

        return NextResponse.json(
            {
                categoryProducts,
            },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            {
                error: "Error while fetching products:",
            },
            { status: 500 }
        )
    }
}
