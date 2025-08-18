import { APP_NAME } from '@/components/constants';

export const metadata = { title: `${APP_NAME} — Auth` };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-emerald-50">
      {children}
    </div>
  );
}