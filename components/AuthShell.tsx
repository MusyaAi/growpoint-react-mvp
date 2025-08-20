'use client';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Доп. min-height для правой колонки с формой (например, "min-h-[620px]") */
  formMinH?: string;
  /** Вариант оформления фона страницы */
  variant?: 'emerald' | 'plain';
  /** Путь к изображению в левой колонке */
  heroImageSrc?: string;
  /** Alt-текст к изображению (можно оставить пустым, если оно декоративное) */
  heroAlt?: string;
  /** Показывать ли изображение на мобильных (по умолчанию true) */
  showHeroOnMobile?: boolean;
};

export default function AuthShell({
  title,
  subtitle,
  children,
  formMinH,
  variant = 'emerald',
  heroImageSrc = '/images/login-hero.png',
  heroAlt = '',
  showHeroOnMobile = true,
}: Props) {
  return (
    <div className={variant === 'emerald' ? 'bg-emerald-50' : 'bg-white'}>
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* 1 кол. на мобиле, 2 кол. на md+; порядок естественный: сначала приветствие, затем форма */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Левая колонка: заголовки + иллюстрация */}
          <section>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-emerald-800">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-base md:text-lg text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Иллюстрация: видна и на мобиле, но ниже и компактнее */}
            <div className={`mt-6 ${showHeroOnMobile ? 'block' : 'hidden'} md:block`}>
              <div className="w-full max-w-xl rounded-2xl border border-emerald-100 bg-white overflow-hidden shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImageSrc}
                  alt={heroAlt}
                  className="w-full h-40 md:h-72 object-cover"
                />
              </div>
            </div>
          </section>

          {/* Правая колонка: форма */}
          <section>
            <div
              className={[
                'rounded-2xl border border-gray-200 bg-white p-6 shadow-sm',
                formMinH ?? '',
              ].join(' ')}
            >
              {children}
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Данные передаются по защищённому каналу.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}