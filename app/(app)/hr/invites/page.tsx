import Header from '@/components/Header';

export default function HrInvitesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Header title="Приглашения" subtitle="Отправка инвайтов и статус onboarding" />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-gray-600">Здесь будет форма приглашения и список отправленных инвайтов.</p>
      </div>
    </div>
  );
}
