import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Happy Birthday Angelica',
  description: 'A special birthday celebration for Angelica',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://w.soundcloud.com/player/api.js"></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
