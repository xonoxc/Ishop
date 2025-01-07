"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useNotification } from "@/components/Notification"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Register() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                variant: "destructive",
            })
            return
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Registration failed")
            }

            toast({
                title: "Registration successful! Please log in.",
            })
            router.push("/login")
        } catch (error) {
            toast({
                title:
                    error instanceof Error
                        ? error.message
                        : "Registration failed",
                variant: "destructive",
            })
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
                        Create your account
                    </h1>
                    <p className="text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link href="/login">Sign in</Link>
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
                        placeholder="Password"
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/20"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/20"
                    />
                    <button
                        type="submit"
                        className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-white/90"
                    >
                        Create account
                    </button>
                </form>
            </div>
        </div>
    )
}
