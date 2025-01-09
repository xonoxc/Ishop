import mongoose, { Schema, models, model } from "mongoose"

export interface ICategory {
    _id: mongoose.Types.ObjectId
    name: string
}

const categorySchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true }
)

const Category = models?.Category || model("Category", categorySchema)

export default Category
