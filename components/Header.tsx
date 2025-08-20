'use client';

import { useMemo } from 'react';
import { useApp } from '@/components/store';

type Props = {
  /** Явный заголовок страницы. Если не задан — будет «Добро пожаловать, …» */
  title?: string;
  /** Подзаголовок/описание страницы (опционально) */
  subtitle?: string;
  /** Правый слот для кнопок действий на странице (опционально) */
  rightSlot?: React.ReactNode;
};

/**
 * Page Header (внутри контента).
 * Не показывает логотип/аватар/роль — это уже есть в TopNav.
 */
export default function Header({ title, subtitle, rightSlot }: Props) {
  const profile = useApp((s) => s.profile);
  const name = useMemo(() => {
    const n = profile?.salutation?.trim() || profile?.name?.trim();
    return n || 'Гость';
  }, [profile?.salutation, profile?.name]);

  const pageTitle = title ?? `Добро пожаловать, ${name}!`;

  return (
    <header className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            {pageTitle}
          </h1>
          {subtitle && (
            <p className="mt-1 text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        {/* Правый слот под кнопки действий страницы (например: «Создать», «Экспорт» и т.п.) */}
        {rightSlot && (
          <div className="shrink-0 flex items-center gap-2">
            {rightSlot}
          </div>
        )}
      </div>
    </header>
  );
}