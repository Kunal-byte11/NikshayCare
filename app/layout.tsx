import "./globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NikshayCare",
  description: "Patient and Healthcare Provider Dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background`}>
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
        <Toaster />
      </body>
    </html>
  )
}

