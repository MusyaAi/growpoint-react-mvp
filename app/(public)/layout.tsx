// app/(public)/layout.tsx
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* мини-хедер с логотипом, без меню */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center">
          <a href="/" className="font-semibold text-gray-900">
            PivotGrow<span className="text-emerald-500">.</span>
          </a>
        </div>
      </header>

      {/* контент страницы (AuthShell сам рисует зелёную подложку и сетку) */}
      <main id="app-main">{children}</main>
    </div>
  );
}