'use client';

import Guard from '@/components/Guard';      // если Гуард ещё не сделали — временно замени на React.Fragment
import TopNav from '@/components/TopNav';

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <Guard role="employee">
      <TopNav />
      <div className="min-h-screen max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </Guard>
  );
}