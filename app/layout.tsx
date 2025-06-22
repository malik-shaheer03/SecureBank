import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SecureBank',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        {/* Optional: add title here as well for completeness */}
        <title>SecureBank</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
