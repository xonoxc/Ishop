"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useHeaderScroll } from "@/hooks/useheaderscroll"
import AuthMenu from "./AuthMenu"
import { cn } from "@/lib/utils"

const HeaderlessRoutes = ["/register", "/login"]

const Logo = dynamic(() => import("@/components/Logo"), { ssr: false })

export default function Header() {
    const { translateY } = useHeaderScroll(8)
    const pathname = usePathname()

    if (HeaderlessRoutes.includes(pathname)) return null

    return (
        <header
            className={cn(
                "sticky top-0 w-full z-40 left-0 bg-background/80 backdrop-blur-lg transition-all duration-300 shadow-sm"
            )}
            style={{
                transform: `translateY(${translateY}px)`,
            }}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity"
                        aria-label="Home"
                    >
                        <Logo />
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        <AuthMenu />
                    </div>
                </div>
            </div>
        </header>
    )
}
