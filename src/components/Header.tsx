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
    const { translateY, scrolled } = useHeaderScroll(8)
    const pathname = usePathname()

    if (HeaderlessRoutes.includes(pathname)) return null

    return (
        <header
            className={cn(
                "sticky top-0 w-full z-40 left-0 bg-background/80 backdrop-blur-lg transition-all duration-300 gap-32 mb-4 py-2 px-4 sm:px-6 lg:px-8 "
            )}
            style={{
                transform: `translateY(${translateY}px)`,
            }}
        >
            <div className="container mx-auto flex items-center justify-between h-16 border border-gray-500/10 rounded-md border-dashed space-y-10">
                <Link
                    href="/"
                    className="px-3 flex items-center gap-2 text-xl font-bold"
                    aria-label="Home"
                >
                    <Logo />
                </Link>

                <AuthMenu />
            </div>
        </header>
    )
}
