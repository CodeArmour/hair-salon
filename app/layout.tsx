import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'hair salon',
  description: 'A modern hair salon website',
  generator: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
