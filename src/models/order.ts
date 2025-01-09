import mongoose, { Schema, model, models } from "mongoose"
import { ImageVariant, ImageVariantType } from "@/models/product"

export type PaymentStatus = "completed" | "failed" | "pending"

interface PopulatedUser {
    _id: mongoose.Types.ObjectId
    email: string
}

interface PopulatedProduct {
    _id: mongoose.Types.ObjectId
    name: string
    imageUrl: string
}

export interface IOrder {
    userId: mongoose.Types.ObjectId | PopulatedUser
    productId: mongoose.Types.ObjectId | PopulatedProduct
    variant: ImageVariant
    razorpayOrderId: string
    razorpayPaymentId?: string
    amount: number
    status: PaymentStatus
    downloadUrl: string
    previewUrl: string
    _id?: mongoose.Types.ObjectId
    createdAt?: Date
    updatedAt?: Date
}

const orderSchema = new Schema<IOrder>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        variant: {
            type: {
                type: String,
                required: true,
                enum: ["SQUARE", "WIDE", "PORTRAIT"] as ImageVariantType[],
                set: (v: string) => v.toUpperCase(),
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            },
            license: {
                type: String,
                required: true,
                enum: ["personal", "commercial"],
            },
        },
        razorpayOrderId: {
            type: String,
            required: true,
        },
        razorpayPaymentId: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["failed", "completed", "pending"],
            default: "pending",
        },
        downloadUrl: {
            type: String,
        },
        previewUrl: {
            type: String,
        },
    },
    { timestamps: true }
)

const Order = models?.Order || model<IOrder>("Order", orderSchema)

export default Order
