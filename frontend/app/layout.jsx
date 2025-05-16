import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import ChatBox from "@/components/chat-box"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Ink Over Matter — Premium Tattoo Studio & Illustrations",
  description: "Custom premium tattoos and illustrations by award-winning artists. Personalized designs and professional studio services.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
          <ChatBox />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}


