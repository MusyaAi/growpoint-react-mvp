export const metadata = { title: "GrowPoint" };
import "../styles/globals.css";
import TopNav from "@/components/TopNav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-50 text-gray-800">
        <TopNav />
        <div className="max-w-4xl mx-auto p-4 sm:px-6 lg:p-8">
          {children}
        </div>
      </body>
    </html>
  );
}
