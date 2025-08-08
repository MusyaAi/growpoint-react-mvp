export default function AIMentorPage(){
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-emerald-600">AI-наставник</h1>
      <p className="mt-4 text-gray-600">Задай вопрос и получи ответ от AI-наставника.</p>
    </div>
  );
}
EOF# AI-наставник
mkdir -p "app/(employee)/ai-mentor"
cat > "app/(employee)/ai-mentor/page.tsx" << 'EOF'
export default function AIMentorPage(){
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-emerald-600">AI-наставник</h1>
      <p className="mt-4 text-gray-600">Задай вопрос и получи ответ от AI-наставника.</p>
    </div>
  );
}
