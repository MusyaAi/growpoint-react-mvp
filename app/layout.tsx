import '@/styles/globals.css';
import { APP_NAME } from '@/components/constants';

export const metadata = {
  title: APP_NAME,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="text-gray-800">
        {children}
      </body>
    </html>
  );
}
