'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/* =========================
 * Types
 * ========================= */

export type Flags = { sleep: boolean; food: boolean; activity: boolean; rest: boolean };

export type CheckIn = {
  id: string;
  dateISO: string;
  emotion: string;
  note?: string;
  flags?: Flags;
};

export type JournalEntry = {
  id: string;
  dateISO: string;
  text: string;
  emotion?: string;
};

export type Language = 'ru' | 'en';

export type Profile = {
  name: string;         // Имя (для приветствия)
  salutation?: string;  // Обращение ИИ
  avatarUrl?: string;   // Ссылка на аватар
  birthDate?: string;   // YYYY-MM-DD
  language: Language;   // Язык интерфейса
  email?: string;       // Почта (в будущем — для входа)
};

/**
 * Старый блок настроек оставляем для обратной совместимости.
 * Поля birthDate/language/email теперь живут в profile,
 * но мы их зеркалим сюда, чтобы старые экраны продолжали работать.
 */
export type Settings = {
  birthDate?: string;
  language: Language;
  email?: string;
};

type State = {
  profile: Profile;
  settings: Settings;
  checkins: CheckIn[];
  lastCheckIn?: CheckIn;
  journal: JournalEntry[];

  /* actions */
  // Универсальный апдейтер профиля (новое, чтобы экран Настроек работал единообразно)
  setProfile: (patch: Partial<Profile>) => void;

  // Существующая логика — сохраняем
  doCheckIn: (p: { emotion: string; note?: string; flags?: Flags }) => void;
  addJournal: (e: { dateISO: string; text: string; emotion?: string }) => void;
  deleteJournal: (id: string) => void;

  // Старые точечные сеттеры — оставляем для обратной совместимости
  setBirthDate: (iso: string) => void;
  setLanguage: (lang: Language) => void;
  setSalutation: (s?: string) => void;
  setProfileName: (n: string) => void;
};

/* =========================
 * Defaults
 * ========================= */

const DEFAULT_PROFILE: Profile = {
  name: 'Елена',
  salutation: 'Елена',
  avatarUrl: '',
  birthDate: '',
  language: 'ru',
  email: '',
};

const DEFAULT_SETTINGS: Settings = {
  language: 'ru',
  birthDate: '',
  email: '',
};

/* =========================
 * Store
 * ========================= */

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      profile: { ...DEFAULT_PROFILE },
      settings: { ...DEFAULT_SETTINGS },
      checkins: [],
      lastCheckIn: undefined,
      journal: [],

      /* ---------- New: универсальный апдейтер профиля ---------- */
      setProfile: (patch) => {
        const prev = get().profile;
        const next: Profile = { ...prev, ...patch };

        // Синхронизируем совместимые поля в settings (для старых экранов)
        const sPrev = get().settings;
        const sNext: Settings = {
          ...sPrev,
          birthDate: next.birthDate ?? sPrev.birthDate,
          language: next.language ?? sPrev.language,
          email: next.email ?? sPrev.email,
        };

        set({ profile: next, settings: sNext });
      },

      /* ---------- Check-in ---------- */
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

      /* ---------- Journal ---------- */
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
        set({ journal: get().journal.filter((e) => e.id !== id) });
      },

      /* ---------- Legacy setters (оставляем для совместимости) ---------- */
      setBirthDate: (iso) => {
        const p = get().profile;
        const s = get().settings;
        set({
          profile: { ...p, birthDate: iso },
          settings: { ...s, birthDate: iso },
        });
      },

      setLanguage: (language) => {
        const p = get().profile;
        const s = get().settings;
        set({
          profile: { ...p, language },
          settings: { ...s, language },
        });
      },

      setSalutation: (salutation) => {
        const p = get().profile;
        set({ profile: { ...p, salutation } });
      },

      setProfileName: (name) => {
        const p = get().profile;
        set({ profile: { ...p, name } });
      },
    }),
    {
      name: 'growpoint-state', // ключ в localStorage
      version: 4,              // ↑ версия стора (была 3)
      storage: createJSONStorage(() => localStorage),

      /* ---------- MIGRATE ---------- */
      migrate: (state: any, version) => {
        if (!state) return state;

        // Базовые заготовки
        const profile: Profile = {
          ...DEFAULT_PROFILE,
          ...(state.profile ?? {}),
        };

        const settings: Settings = {
          ...DEFAULT_SETTINGS,
          ...(state.settings ?? {}),
        };

        // Если в старой схеме были поля только в settings — переносим в profile
        if (!profile.birthDate && settings.birthDate) profile.birthDate = settings.birthDate;
        if (!profile.language && settings.language) profile.language = settings.language;
        if (!profile.email && settings.email) profile.email = settings.email;

        // Если в старой схеме чего-то нет — гарантируем дефолты
        if (profile.name == null) profile.name = DEFAULT_PROFILE.name;
        if (profile.salutation == null) profile.salutation = DEFAULT_PROFILE.salutation;
        if (profile.avatarUrl == null) profile.avatarUrl = DEFAULT_PROFILE.avatarUrl;
        if (profile.birthDate == null) profile.birthDate = DEFAULT_PROFILE.birthDate;
        if (profile.language == null) profile.language = DEFAULT_PROFILE.language;
        if (profile.email == null) profile.email = DEFAULT_PROFILE.email;

        // Журнал/чекины
        const checkins: CheckIn[] = Array.isArray(state.checkins) ? state.checkins : [];
        const journal: JournalEntry[] = Array.isArray(state.journal) ? state.journal : [];

        return {
          ...state,
          profile,
          settings: {
            ...settings,
            // Зеркалим из профиля — чтобы старые экраны не сломались
            birthDate: profile.birthDate,
            language: profile.language,
            email: profile.email,
          },
          checkins,
          journal,
        } as State;
      },

      /* ---------- partialize ---------- */
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