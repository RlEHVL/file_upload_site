import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '프로그램 업로드 사이트',
  description: '프로그램을 쉽게 업로드하고 공유할 수 있는 웹사이트',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto py-6 px-4">
          {children}
        </main>
      </body>
    </html>
  )
} 