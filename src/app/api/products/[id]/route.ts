import { connectToDatabase } from "@/db/dbConn"
import { NextRequest, NextResponse } from "next/server"
import Product from "@/models/product"

export async function Get(
    request: NextRequest,
    props: {
        params: Promise<{ id: string }>
    }
) {
    try {
        const { id } = await props.params

        await connectToDatabase()

        const product = await Product.findById(id).lean()
        if (!product) {
            return NextResponse.json(
                { error: "No Product Found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ product }, { status: 200 })
    } catch (error) {
        console.error("Error fetching product:", error)
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    }
}
