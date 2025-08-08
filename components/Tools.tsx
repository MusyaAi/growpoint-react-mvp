'use client';
export default function Tools(){
  const Item = ({icon, text}:{icon:React.ReactNode, text:string}) => (
    <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
      <span className="w-6 h-6 text-indigo-500 mr-4">{icon}</span><span className="font-semibold">{text}</span>
    </a>
  );
  return (
    <div className="bg-white p-6 rounded-2xl card-shadow">
      <h2 className="text-lg font-bold mb-4">Инструменты</h2>
      <div className="space-y-3">
        <Item icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18"></path></svg>} text="Моя запись"/>
        <Item icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664l-3-2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} text="Практики"/>
        <Item icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>} text="Сканер тела"/>
        <Item icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>} text="Карта восстановления"/>
      </div>
    </div>
  );
}
