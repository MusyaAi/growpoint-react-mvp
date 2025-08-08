'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Дашборд" },
  { href: "/growth-map", label: "Карта роста" },
  { href: "/check-in", label: "Чек-ин" },
  { href: "/emotional-dictionary", label: "Словарь" },
  { href: "/biorhythms", label: "Биоритмы" },
  { href: "/knowledge-base", label: "Библиотека" },
  { href: "/ai-nudge", label: "AI" },
  { href: "/settings", label: "Настройки" },   // <- добавили
];

export default function Nav(){
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-extrabold tracking-tight">
          growpoint<span className="text-emerald-500">.</span>
        </div>
        <div className="hidden sm:flex gap-4">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-2 py-1 rounded ${path===l.href ? 'text-emerald-700 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
