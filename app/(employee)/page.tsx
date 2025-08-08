import GrowthCard from "@/components/GrowthCard";
import BiorhythmMini from "@/components/BiorhythmMini";
import CheckinEmoji from "@/components/CheckinEmoji";
import JournalMini from "@/components/JournalMini";
import AssistantCard from "@/components/AssistantCard";

export const metadata = { title: "GrowPoint — дашборд" };

export default function Dashboard(){
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold text-emerald-700">Привет, Елена!</h1>
        <a href="/settings" className="text-sm text-gray-500 hover:text-gray-900">Настройки</a>
      </div>

      <GrowthCard/>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BiorhythmMini/>
        <CheckinEmoji/>
      </div>

      <AssistantCard/>

      <JournalMini/>
    </div>
  );
}
