"use client"

import {
    Home,
    LayoutDashboard,
    LogOut,
    Package,
    Menu,
    UserCircle,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Logo from "@/components/Logo"

const HeaderlessRoutes = ["/register", "/login"]

export default function Header() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const { toast } = useToast()

    const handleSignOut = async () => {
        try {
            await signOut()
            toast({
                title: "Signed out successfully",
            })
        } catch (error) {
            toast({
                title: "Failed to sign out",
                variant: "destructive",
            })
        }
    }

    if (HeaderlessRoutes.includes(pathname)) return null

    return (
        <header className="sticky top-0 z-40 w-full shadow-md bg-background">
            <div className="container mx-auto flex items-center justify-between h-16">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold"
                    aria-label="Home"
                >
                    <Logo />
                </Link>

                <div className="flex gap-2 text-center justify-center">
                    {session && (
                        <div className="username flex items-center justify-center">
                            <UserCircle className="w-4 h-4" />
                            <span>{session.user?.email?.split("@")[0]}</span>
                        </div>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {session ? (
                                <>
                                    {session.user?.role === "admin" && (
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/admin"
                                                className="flex items-center gap-2"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/orders"
                                            className="flex items-center gap-2"
                                        >
                                            <Package className="w-4 h-4" />
                                            <span>Orders</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onSelect={handleSignOut}
                                        className="text-red-600"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem asChild>
                                        <Link href="/login">Login</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/register">
                                            create account
                                        </Link>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
