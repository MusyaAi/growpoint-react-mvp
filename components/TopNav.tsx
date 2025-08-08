'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: '/', label: 'Дашборд' },
  { href: '/library', label: 'Библиотека' },
  { href: '/dictionary', label: 'Словарь' },
  { href: '/settings', label: 'Настройки' },
];

export default function TopNav(){
  const path = usePathname();
  return (
    <nav className="w-full bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900">
          <span className="tracking-tight">growpoint</span><span className="text-emerald-500">.</span>
        </Link>
        <ul className="flex items-center gap-5 text-sm">
          {items.map(it => {
            const active = path === it.href || (it.href !== '/' && path?.startsWith(it.href));
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={`px-2 py-1 rounded-md ${active ? 'text-emerald-700 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
