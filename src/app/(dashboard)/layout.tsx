export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar will be added here */}
      <aside className="hidden w-64 border-r md:block">{/* Sidebar content */}</aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Header will be added here */}
        <header className="border-b px-6 py-4">
          <span className="font-semibold">Dinnartec</span>
        </header>

        {/* Page content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
