import { useEffect, useState } from "react"

/**
 * Returns a translateY value (negative = move up) and a boolean `scrolled`
 * based on window.scrollY. `maxTranslate` is the maximum pixels it will shift.
 */
export function useHeaderScroll(maxTranslate = 8) {
    const [translateY, setTranslateY] = useState(0)

    useEffect(() => {
        let ticking = false

        const init = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const raw = window.scrollY
                    const capped = Math.min(raw, maxTranslate * 5)
                    const t = -((capped / (maxTranslate * 5)) * maxTranslate)
                    setTranslateY(t)
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener("scroll", init, { passive: true })
        init()

        return () => window.removeEventListener("scroll", init)
    }, [maxTranslate])

    const scrolled = translateY !== 0
    return { translateY, scrolled }
}
