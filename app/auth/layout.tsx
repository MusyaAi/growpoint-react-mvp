export const metadata = { title: 'GrowPoint — Auth' };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-emerald-50">
      {children}
    </div>
  );
}