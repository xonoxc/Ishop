"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useNotification } from "@/components/Notification"
import Link from "next/link"

export default function Login() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const router = useRouter()
    const { showNotification } = useNotification()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (result?.error) {
            showNotification(result.error, "error")
        } else {
            showNotification("Login Successful!", "error")
            router.push("/")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#161617] to-black text-white p-6">
            <button
                onClick={() => router.back()}
                className="flex items-center text-sm text-gray-400 hover:text-white"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </button>
            <div className="max-w-sm mx-auto mt-12 space-y-8">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full mb-6" />
                    <h1 className="text-2xl font-semibold">
                        Yooo, welcome back!
                    </h1>
                    <p className="text-sm text-gray-400">
                        First time here?{" "}
                        <Link href={"/register"}>Sign up </Link>
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Your email"
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/20"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/20"
                    />
                    <button
                        type="submit"
                        className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-white/90"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    )
}
