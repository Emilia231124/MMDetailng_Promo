export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* TODO: Auth guard */}
      <div className="flex">
        <aside className="w-64 min-h-screen bg-[var(--bg-secondary)] p-4">
          <nav data-component="AdminNav">
            {/* TODO: Admin navigation */}
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
