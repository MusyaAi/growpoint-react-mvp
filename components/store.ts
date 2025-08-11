'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/* ---------- доменные типы ---------- */
export type Flags = { sleep: boolean; food: boolean; activity: boolean; rest: boolean };
export type CheckIn = { id: string; dateISO: string; emotion: string; note?: string; flags?: Flags };
export type JournalEntry = { id: string; dateISO: string; text: string; emotion?: string };

export type Profile = {
  name: string;             // Имя (для приветствия)
  salutation?: string;      // Формула обращения от ИИ
  avatarUrl?: string;       // Ссылка на аватар (опц.)
  birthDate?: string;       // YYYY-MM-DD (для биоритмов)
  language?: 'ru' | 'en';   // Язык интерфейса
  email?: string;           // Почта (опц.)
};

export type Settings = {
  birthDate?: string;
  language: 'ru' | 'en';
  email?: string;
};

export type Role = 'employee' | 'hr' | 'admin';
export type Auth = {
  isAuth: boolean;
  role: Role;
  onboardingDone: boolean;
  email?: string;
};

/* ---------- state ---------- */
type State = {
  profile: Profile;
  settings: Settings;
  checkins: CheckIn[];
  lastCheckIn?: CheckIn;
  journal: JournalEntry[];

  auth: Auth;

  /* actions: существующие */
  doCheckIn: (p: { emotion: string; note?: string; flags?: Flags }) => void;
  addJournal: (e: { dateISO: string; text: string; emotion?: string }) => void;
  deleteJournal: (id: string) => void;

  setBirthDate: (iso: string) => void;
  setLanguage: (lang: 'ru'|'en') => void;
  setSalutation: (s?: string) => void;
  setProfileName: (n: string) => void;

  /* универсальные апдейтеры */
  setProfile: (p: Partial<Profile>) => void;
  updateProfile: (p: Partial<Profile>) => void;
  updateSettings: (s: Partial<Settings>) => void;
  updateEmail: (email: string) => void;

  /* auth */
  login: (p: { email?: string; role: Role }) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  setOnboardingDone: (done: boolean) => void;
};

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      /* стартовые значения */
      profile: { name: 'Елена', salutation: 'Елена' },
      settings: { language: 'ru', birthDate: undefined },
      checkins: [],
      lastCheckIn: undefined,
      journal: [],

      auth: { isAuth: false, role: 'employee', onboardingDone: true, email: undefined },

      /* --------- actions --------- */

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

      /* универсальные апдейтеры (удобно вызывать из форм) */
      setProfile: (p) => set({ profile: { ...get().profile, ...p } }),
      updateProfile: (p) => set({ profile: { ...get().profile, ...p } }),
      updateSettings: (s) => set({ settings: { ...get().settings, ...s } }),
      updateEmail: (email) => {
        set({ settings: { ...get().settings, email } });
        set({ profile:  { ...get().profile,  email } });
      },

      /* auth */
      login: ({ email, role }) => {
        const prev = get().auth;
        set({ auth: { ...prev, isAuth: true, role, email } });
      },
      logout: () => {
        const prev = get().auth;
        set({ auth: { ...prev, isAuth: false } });  // данные профиля/локальные записи не трогаем
      },
      setRole: (role) => set({ auth: { ...get().auth, role } }),
      setOnboardingDone: (onboardingDone) => set({ auth: { ...get().auth, onboardingDone } }),
    }),
    {
      name: 'growpoint-state',
      version: 5,
      storage: createJSONStorage(() => localStorage),
      migrate: (state: any) => {
        if (!state) return state;
        if (!state.profile)  state.profile  = { name: 'Елена', salutation: 'Елена' };
        if (!state.settings) state.settings = { language: 'ru', birthDate: undefined };
        if (!state.checkins) state.checkins = [];
        if (!state.journal)  state.journal  = [];
        if (!state.auth)     state.auth     = { isAuth: false, role: 'employee', onboardingDone: true, email: undefined };
        return state as State;
      },
      partialize: (s) => ({
        profile: s.profile,
        settings: s.settings,
        checkins: s.checkins,
        lastCheckIn: s.lastCheckIn,
        journal: s.journal,
        auth: s.auth,
      }),
    }
  )
);

/* ---------- удобные селекторы для компонентов ---------- */
export const selectIsAuthed   = (s: State) => s.auth.isAuth;
export const selectUserName   = (s: State) => s.profile.name || 'Гость';
export const selectAvatarUrl  = (s: State) => s.profile.avatarUrl;
export const selectRole       = (s: State) => s.auth.role;