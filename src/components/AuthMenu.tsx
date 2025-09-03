import {
    LayoutDashboard,
    LogOut,
    Package,
    Menu,
    UserCircle,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export default function AuthMenu() {
    const { data: session } = useSession()
    const { toast } = useToast()
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut()
            toast({
                title: "Signed out successfully",
            })
            router.replace("/login")
        } catch (error) {
            toast({
                title: "Failed to sign out",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex items-center gap-3">
            {session && (
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <UserCircle className="w-5 h-5" />
                    <span className="truncate max-w-[120px]">
                        {session.user?.email?.split("@")[0]}
                    </span>
                </div>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-md border-muted-foreground/20"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-56 shadow-lg rounded-xl"
                >
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
                                <Link href="/register">Create account</Link>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
