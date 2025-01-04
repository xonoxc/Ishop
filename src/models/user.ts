import mongoose, { Schema, models, model } from "mongoose"
import bcrypt from "bcryptjs"

export type Role = "admin" | "user"

export interface IUser {
    email: string
    password: string
    role: Role
    _id?: mongoose.Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            required: true,
        },
    },
    { timestamps: true }
)

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = models?.User || model<IUser>("User", userSchema)

export default User
