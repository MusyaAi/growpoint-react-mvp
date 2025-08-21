import Link from 'next/link';

export default function NotFoundDictionary() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900">Раздел не найден</h1>
      <p className="mt-2 text-gray-600">
        Попробуйте вернуться на <Link href="/emotional-dictionary" className="text-emerald-700 hover:underline">страницу библиотеки</Link>.
      </p>
    </div>
  );
}
