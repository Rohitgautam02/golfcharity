import { Inter, DM_Serif_Display } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Toaster } from "react-hot-toast"

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
})

const dmSerif = DM_Serif_Display({ 
  subsets: ["latin"], 
  weight: "400",
  variable: "--font-serif" 
})

export const metadata = {
  title: "GolfGives | Play Golf. Give Back. Win Big.",
  description: "The UK's first golf subscription that turns your scores into monthly prizes while funding charities that matter to you.",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⛳</text></svg>',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dmSerif.variable} font-sans bg-brand-cream text-brand-charcoal min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
