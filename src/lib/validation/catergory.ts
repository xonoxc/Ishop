import { z } from "zod"

export const categoryNameSchema = z
    .string()
    .regex(
        /^[a-z]{1,9}$/,
        "Must be lowercase letters and less than 10 characters"
    )
