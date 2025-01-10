"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import BackBtn from "@/components/BackBtn"

export default function Register() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false)
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
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
            setLoading(true)
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
        } finally {
            setLoading(false)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#161617] to-black text-white p-6 space-y-40">
            <BackBtn />
            <div className="max-w-sm mx-auto mt-12 space-y-8">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full mb-6" />
                    <h1 className="text-2xl font-semibold">
                        Create your account
                    </h1>
                    <p className="text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-gray-400">
                            Sign in
                        </Link>
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
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/20 pr-10"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/20 pr-10"
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-white/90 flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span>creating your account...</span>
                            </>
                        ) : (
                            "Create account"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
