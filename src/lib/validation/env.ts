import { z } from "zod"

export const envSchema = z.object({
    MONGODB_URI: z.string(),
    NEXTAUTH_SECRET: z.string(),
})

const env = envSchema.safeParse(process.env)

if (!env.success) {
    console.error("error validating env variables", env.error)
    process.exit(1)
}

export const envVariables = env.data
