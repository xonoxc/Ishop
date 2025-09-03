import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="min-h-[70vh] flex justify-center items-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
    )
}
