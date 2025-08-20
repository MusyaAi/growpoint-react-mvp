// app/layout.tsx
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { APP_NAME } from '@/components/constants';

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'AI-платформа развития soft skills и лидерства',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="text-gray-800 min-h-screen bg-white">
        <a
          href="#app-main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-white border rounded px-3 py-2"
        >
          Перейти к содержимому
        </a>
        {children}
      </body>
    </html>
  );
}
