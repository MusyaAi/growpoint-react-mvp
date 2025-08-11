'use client';

import Image from 'next/image';

type Props = {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  /** Можно переопределять при желании на страницах, по умолчанию хватает для «Вход» */
  formMinH?: string; // tailwind class, напр. 'min-h-[520px]'
  children: React.ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  imageSrc = '/images/login-hero.png',
  formMinH = 'min-h-[520px]',
  children,
}: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:[grid-template-columns:1.05fr_1fr]">
        {/* ЛЕВАЯ КАРТОЧКА (текст + картинка) */}
        <div className="rounded-2xl bg-emerald-50/70 p-6 shadow-sm">
          <h1 className="text-3xl font-extrabold leading-tight text-emerald-800">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-gray-700">{subtitle}</p>
          )}

          {/* Снижаем визуальную «тяжесть»: ограниченная высота/соотношение */}
          <div className="mt-6 overflow-hidden rounded-xl border border-emerald-100/60 bg-white/40">
            <Image
              src={imageSrc}
              alt="GrowPoint login hero"
              width={1200}
              height={800}
              // фиксированная, но адаптивная высота — выглядит опрятно на десктопе и не давит
              className="h-[260px] w-full object-cover md:h-[300px] lg:h-[320px]"
              priority
            />
          </div>
        </div>

        {/* ПРАВАЯ КАРТОЧКА (форма) */}
        <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${formMinH} flex flex-col`}>
          {children}
        </div>
      </div>
    </div>
  );
}