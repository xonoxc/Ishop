import { connectToDatabase } from "@/db/dbConn"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import User, { Role } from "@/models/user"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials: any): Promise<any> {
                if (!credentials.email || !credentials.password)
                    throw new Error("Missing email or password")

                await connectToDatabase()
                try {
                    const user = await User.findOne({
                        email: credentials.email,
                    })

                    if (!user)
                        throw new Error("No user was found with this email")

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if (!isPasswordCorrect) throw new Error("Invalid Password")

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        role: user.role,
                    }
                } catch (error) {
                    console.error("Auth error:", error)
                    throw error
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as Role
                session.user.id = token.id as string
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET!,
}
