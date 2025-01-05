import Razorpay from "razorpay"
import { envVariables } from "@/lib/validation/env"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth/auth"
import { getServerSession } from "next-auth"
import { connectToDatabase } from "@/db/dbConn"
import Order from "@/models/order"

const razorPay = new Razorpay({
    key_id: envVariables.RAZORPAY_KEY_ID,
    key_secret: envVariables.RAZORPAY_KEY_SECRET,
})

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session)
            return NextResponse.json(
                { error: "Unauthorized request" },
                { status: 401 }
            )

        const { productId, variant } = await request.json()
        if (!productId || !variant)
            return NextResponse.json(
                { error: "Invalid request" },
                { status: 400 }
            )

        await connectToDatabase()

        const order = await razorPay.orders.create({
            amount: Math.round(variant.price * 100),
            currency: "USD",
            receipt: `receipt${Date.now()}`,
            notes: {
                productId: productId.toString(),
            },
        })

        const newOrder = await Order.create({
            userId: session.user.id,
            productId,
            variant,
            razorpayId: order.id,
            amount: variant.price,
            status: "pending",
        })

        return NextResponse.json(
            {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                dbOrderId: newOrder._id,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error creating order:", error)
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        )
    }
}
