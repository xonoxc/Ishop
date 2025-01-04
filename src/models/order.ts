import mongoose, { Schema, model, models } from "mongoose"
import { ImageVariant, License } from "@/models/product"

export interface IOrder {
    userId: mongoose.Types.ObjectId
    productId: mongoose.Types.ObjectId
    variant: ImageVariant
    price: number
    license: License
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
    },
    { timestamps: true }
)

const Order = models?.Order || model<IOrder>("Order", orderSchema)

export default Order
