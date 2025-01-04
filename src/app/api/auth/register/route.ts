import { connectToDatabase } from "@/db/dbConn"
import User from "@/models/user"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password)
            return NextResponse.json(
                { error: "Both email and password are required" },
                { status: 400 }
            )

        await connectToDatabase()

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { error: "Email is already taken" },
                { status: 400 }
            )
        }

        await User.create({
            email,
            password,
            role: "user",
        })

        return NextResponse.json(
            { message: "User registration successfull!" },
            { status: 201 }
        )
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
        )
    }
}
