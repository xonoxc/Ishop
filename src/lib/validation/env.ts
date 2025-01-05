import { z } from "zod"

export const envSchema = z.object({
    MONGODB_URI: z.string(),
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string(),
    IMAGEKIT_PRIVATE_KEY: z.string(),
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string(),
    NEXTAUTH_SECRET: z.string(),
    RAZORPAY_KEY_ID: z.string(),
    RAZORPAY_KEY_SECRET: z.string(),
})

const env = envSchema.safeParse(process.env)

if (!env.success) {
    console.error("error validating env variables", env.error)
    process.exit(1)
}

export const envVariables = env.data
