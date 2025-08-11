import '@/styles/globals.css';

export const metadata = { title: 'GrowPoint' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="text-gray-800">
        {children}
      </body>
    </html>
  );
}
