"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function Login() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true)
        e.preventDefault()
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (result?.error) {
            toast({
                title: result.error,
                variant: "destructive",
            })
        } else {
            toast({
                title: "Login successful",
            })
            router.push("/")
        }
        setLoading(false)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
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
            <div className="max-w-sm mx-auto mt-16 space-y-16">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full mb-6" />
                    <h1 className="text-2xl font-semibold">
                        Yooo, welcome back!
                    </h1>
                    <p className="text-sm text-gray-400">
                        First time here?{" "}
                        <Link
                            href={"/register"}
                            className="text-gray-400 hover:text-white"
                        >
                            Sign up
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
                            placeholder="••••••••"
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
                    <button
                        type="submit"
                        className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-white/90 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span>Logging in ...</span>
                            </>
                        ) : (
                            "Log in"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
