import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Dunany Country Club – 2026 Performance Series',
  description: 'Register for the Dunany Country Club 2026 Performance Series. Six shows, all starting at 7:30 PM.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
