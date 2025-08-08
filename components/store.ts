'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Flags = { sleep: boolean; food: boolean; activity: boolean; rest: boolean };
export type CheckIn = { id: string; dateISO: string; emotion: string; note?: string; flags?: Flags };
export type JournalEntry = { id: string; dateISO: string; text: string; emotion?: string };

export type Profile = {
  name: string;
  salutation?: string;
};

export type Settings = {
  birthDate?: string;           // YYYY-MM-DD
  language: 'ru'|'en';
};

type State = {
  profile: Profile;
  settings: Settings;
  checkins: CheckIn[];
  lastCheckIn?: CheckIn;
  journal: JournalEntry[];

  // actions
  doCheckIn: (p: { emotion: string; note?: string; flags?: Flags }) => void;
  addJournal: (e: { dateISO: string; text: string; emotion?: string }) => void;
  deleteJournal: (id: string) => void;

  setBirthDate: (iso: string) => void;
  setLanguage: (lang: 'ru'|'en') => void;
  setSalutation: (s?: string) => void;
  setProfileName: (n: string) => void;
};

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      profile: { name: 'Елена', salutation: 'Елена' },
      settings: { language: 'ru', birthDate: undefined },
      checkins: [],
      lastCheckIn: undefined,
      journal: [],

      doCheckIn: ({ emotion, note, flags }) => {
        const entry: CheckIn = {
          id: `ci_${Date.now().toString(36)}`,
          dateISO: new Date().toISOString(),
          emotion,
          note,
          flags,
        };
        const next = [...get().checkins, entry].slice(-365);
        set({ checkins: next, lastCheckIn: entry });
      },

      addJournal: ({ dateISO, text, emotion }) => {
        const entry: JournalEntry = {
          id: `jn_${Date.now().toString(36)}`,
          dateISO,
          text,
          emotion,
        };
        set({ journal: [entry, ...get().journal].slice(0, 500) });
      },

      deleteJournal: (id) => {
        set({ journal: get().journal.filter(e => e.id !== id) });
      },

      setBirthDate: (iso) => set({ settings: { ...get().settings, birthDate: iso } }),
      setLanguage: (language) => set({ settings: { ...get().settings, language } }),
      setSalutation: (salutation) => set({ profile: { ...get().profile, salutation } }),
      setProfileName: (name) => set({ profile: { ...get().profile, name } }),
    }),
    {
      name: 'growpoint-state',          // ключ в localStorage
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate: (state: any, version) => {
        // Поддержка старых версий: аккуратно добавляем поля, если их не было
        if (!state) return state;
        if (!state.profile) state.profile = { name: 'Елена', salutation: 'Елена' };
        if (!state.settings) state.settings = { language: 'ru', birthDate: undefined };
        if (!state.checkins) state.checkins = [];
        if (!state.journal) state.journal = [];
        return state as State;
      },
      partialize: (s) => ({
        profile: s.profile,
        settings: s.settings,
        checkins: s.checkins,
        lastCheckIn: s.lastCheckIn,
        journal: s.journal,
      }),
    }
  )
);
