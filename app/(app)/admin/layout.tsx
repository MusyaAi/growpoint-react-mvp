'use client';
import Guard from '@/components/Guard';
import TopNav from '@/components/TopNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Guard role="admin">
      <TopNav />
      <div className="min-h-screen max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </Guard>
  );
}