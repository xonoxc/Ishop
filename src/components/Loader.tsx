import { Loader2 } from "lucide-react"

interface LoaderProps {
    size?: number
    text?: string
}

export function Loader({ size = 55, text = "Loading..." }: LoaderProps) {
    return (
        <div className="flex flex-col items-center justify-center w-full h-64 space-y-4">
            <Loader2 className="animate-spin" size={size} />
            <span className="text-lg font-medium text-gray-600">{text}</span>
        </div>
    )
}
