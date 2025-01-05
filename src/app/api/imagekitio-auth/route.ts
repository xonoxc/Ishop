import ImageKit from "imagekit"
import { NextResponse } from "next/server"
import { envVariables } from "@/lib/validation/env"

const imagekit = new ImageKit({
    publicKey: envVariables.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: envVariables.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: envVariables.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
})

export async function GET() {
    try {
        const authenticationParameters = imagekit.getAuthenticationParameters()

        return NextResponse.json(authenticationParameters)
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}
