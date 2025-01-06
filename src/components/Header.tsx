"use client"
import { useNotification } from "@/components/Notification"
import { Home, LogOut, Package, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"

const HeaderlessRoutes = ["/register", "/login"]

export default function Header() {
    const pathname = usePathname()
    if (HeaderlessRoutes.includes(pathname)) return null

    const { data: session } = useSession()
    const { showNotification } = useNotification()

    const handleSignOut = async () => {
        try {
            await signOut()
            showNotification("Signed out successfully", "success")
        } catch (error) {
            showNotification("Failed to sign out", "error")
        }
    }

    return (
        <header className="navbar bg-base-300 sticky top-0 z-40 shadow-md w-full  flex items-center justify-center">
            <div className="container mx-auto flex items-center justify-between">
                <Link
                    href="/"
                    className="btn btn-ghost text-xl gap-2 normal-case font-bold"
                    aria-label="Home"
                    onClick={() =>
                        showNotification("Welcome to ImageKit Shop", "info")
                    }
                >
                    <span className="flex items-center gap-2">
                        <Home className="w-5 h-5" />
                        ImageKit Shop
                    </span>
                </Link>
                <div className="flex items-center gap-2">
                    <div className="dropdown dropdown-end flex">
                        <ul
                            tabIndex={0}
                            className="dropdown-content z-50 bg-base-100 shadow-lg rounded-box w-64 mt-2 py-2"
                        >
                            {session ? (
                                <div className="flex items-center justify-center gap-2">
                                    <li className="px-4 py-1 text-sm text-gray-500 flex gap-1">
                                        <User className="w-5 h-5" />
                                        {session.user?.email?.split("@")[0]}
                                    </li>
                                    {session.user?.role === "admin" && (
                                        <li>
                                            <Link
                                                href="/admin"
                                                className="block px-4 py-2 hover:bg-base-200"
                                                onClick={() =>
                                                    showNotification(
                                                        "Welcome to Admin Dashboard",
                                                        "info"
                                                    )
                                                }
                                            >
                                                Admin Dashboard
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <Link
                                            href="/orders"
                                            className="block px-2 py-2 hover:bg-base-200 text-sm"
                                        >
                                            <Package />
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleSignOut}
                                            className="bg-white text-black p-2 rounded-lg flex items-center text-sm gap-2"
                                        >
                                            Logout
                                            <LogOut size={14} />
                                        </button>
                                    </li>
                                </div>
                            ) : (
                                <li>
                                    <Link
                                        href="/login"
                                        className="block px-4 py-2 hover:bg-base-200"
                                        onClick={() =>
                                            showNotification(
                                                "Please sign in to continue",
                                                "info"
                                            )
                                        }
                                    >
                                        Login
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    )
}
