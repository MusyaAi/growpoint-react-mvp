export default function EmotionalDictionaryLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Фон на весь вьюпорт, под всем контентом */}
      <div className="fixed inset-0 -z-10 bg-emerald-50" />
      {children}
    </div>
  );
}