'use client';

import GrowthCard from "@/components/GrowthCard";
import BiorhythmMini from "@/components/BiorhythmMini";
import CheckinEmoji from "@/components/CheckinEmoji";
import JournalMini from "@/components/JournalMini";
import AssistantCard from "@/components/AssistantCard";
import { useApp } from "@/components/store";

export default function Dashboard() {
  const name = (useApp(s => s.profile?.name) || "Гость").trim();

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold text-emerald-700">
          Привет, {name}!
        </h1>
        <a
          href="/settings"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          Настройки
        </a>
      </div>

      <GrowthCard />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BiorhythmMini />
        <CheckinEmoji />
      </div>

      <AssistantCard />

      <JournalMini />
    </div>
  );
}