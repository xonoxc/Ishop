import { authOptions } from "@/lib/auth/auth"
import { connectToDatabase } from "@/db/dbConn"
import Order from "@/models/order"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized request" },
                { status: 401 }
            )
        }

        await connectToDatabase()
        const orders = await Order.find({ userId: session.user.id })
            .populate({
                path: "productId",
                select: "imageUrl  name",
                options: {
                    strictPopulate: false,
                },
            })
            .sort({ createdAt: -1 })
            .lean()

        const validOrders = orders.map(order => ({
            ...order,
            productId: order.productId || {
                imageUrl: null,
                name: "Product is no longer available",
            },
        }))

        return NextResponse.json({ validOrders }, { status: 200 })
    } catch (error) {
        console.error("Error fetching orders:", error)
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        )
    }
}
