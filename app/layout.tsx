import "@/styles/globals.css"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="max-w-2xl mx-auto">
        <header className="py-12">
          <h1 className="text-6xl font-bold">Blog.</h1>
        </header>
        <main className="prose">{children}</main>
      </body>
    </html>
  )
}
