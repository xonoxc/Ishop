import { connectToDatabase } from "@/db/dbConn"
import { categoryNameSchema } from "@/lib/validation/catergory"
import Category from "@/models/category"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
    try {
        await connectToDatabase()

        const categories = await Category.find({}).lean()
        if (categories.length === 0)
            return NextResponse.json(
                {
                    message: "No categories found",
                },
                { status: 200 }
            )

        return NextResponse.json(
            {
                categories,
            },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            {
                error: "Errror fetching categories",
            },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json()

        const validationResult = categoryNameSchema.safeParse(name)
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.message },
                { status: 400 }
            )
        }

        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            return NextResponse.json(
                { error: "Category already exist" },
                { status: 400 }
            )
        }

        const newCategory = await Category.create({ name })
        if (!newCategory) {
            return NextResponse.json(
                { error: "Error while creating new category" },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                message: "Category created successfully",
            },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            {
                error: "Something went wrong",
            },
            { status: 500 }
        )
    }
}
