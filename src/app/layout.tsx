import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import Providers from "@/components/Providers"
import Header from "@/components/Header"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Estore",
    description: "Image Selling point",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Script
                    src="https://checkout.razorpay.com/v1/checkout.js"
                    strategy="lazyOnload"
                />
                <Providers>
                    <Header />
                    <main className="overflow-clip">{children}</main>
                </Providers>
            </body>
        </html>
    )
}
