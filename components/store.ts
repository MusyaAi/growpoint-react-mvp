'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/* ---------- импорты для RBAC и API-ответа ---------- */
import type { Role } from '@/lib/models/roles';
import type { AuthResponse } from '@/lib/api/auth';

/* ---------- доменные типы (как у вас были) ---------- */
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

/* ---------- старая модель auth (оставляем для совместимости) ---------- */
export type Auth = {
  isAuth: boolean;
  role: Role;              // текущая активная роль (синхронизируем с user.activeRole)
  onboardingDone: boolean;
  email?: string;
};

/* ---------- новая модель пользователя стора ---------- */
export type AppUser = {
  email: string;
  roles: Role[];           // все роли пользователя
  activeRole: Role;        // активная роль (для маршрутизации/guard’ов)
};

/* login теперь принимает и новый AuthResponse, и старую форму */
type MinimalAuthSession = { email?: string; role: Role };
type LoginArg = AuthResponse | MinimalAuthSession;

/* ---------- state ---------- */
type State = {
  profile: Profile;
  settings: Settings;
  checkins: CheckIn[];
  lastCheckIn?: CheckIn;
  journal: JournalEntry[];

  /* новая сущность пользователя */
  user: AppUser | null;

  /* старая auth-секция — оставляем для обратной совместимости */
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

  /* auth / rbac */
  login: (p: LoginArg) => void;    // теперь поддерживает AuthResponse И старый формат
  logout: () => void;
  setRole: (role: Role) => void;   // оставляем как алиас для setActiveRole
  setActiveRole: (role: Role) => void;
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

      user: null,

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

      /* ---------- auth / rbac ---------- */
      login: (arg: LoginArg) => {
        // Новый путь: пришёл полноценный AuthResponse из API-слоя
        if ((arg as AuthResponse)?.user) {
          const res = arg as AuthResponse;
          const primary = res.user.roles[0]; // по умолчанию первая роль; можно сохранять выбор
          set({
            user: {
              email: res.user.email,
              roles: res.user.roles,
              activeRole: primary,
            },
            // синхронизируем старую auth-модель для обратной совместимости
            auth: {
              ...get().auth,
              isAuth: true,
              email: res.user.email,
              role: primary,
            },
          });
          return;
        }

        // Старый путь: { email?, role } — поддерживаем, чтобы не ломать старый код
        const { email, role } = arg as MinimalAuthSession;
        set({
          user: {
            email: email ?? 'unknown@local',
            roles: [role],
            activeRole: role,
          },
          auth: {
            ...get().auth,
            isAuth: true,
            email,
            role,
          },
        });
      },

      logout: () => {
        const prev = get().auth;
        set({
          user: null,
          auth: { ...prev, isAuth: false },
        });
      },

      setActiveRole: (role: Role) => {
        const u = get().user;
        if (!u) return;
        if (!u.roles.includes(role)) return; // не даём выбрать роль, которой у пользователя нет
        set({
          user: { ...u, activeRole: role },
          auth: { ...get().auth, role }, // поддерживаем старое поле auth.role
        });
      },

      // Старое API — оставляем как алиас, чтобы не искать все вызовы
      setRole: (role: Role) => {
        get().setActiveRole(role);
      },

      setOnboardingDone: (onboardingDone) => set({ auth: { ...get().auth, onboardingDone } }),
    }),
    {
      name: 'growpoint-state',
      version: 6, // ↑ bump: добавили поле user и поменяли login-контракт
      storage: createJSONStorage(() => localStorage),
      migrate: (state: any) => {
        if (!state) return state;
        if (!state.profile)  state.profile  = { name: 'Елена', salutation: 'Елена' };
        if (!state.settings) state.settings = { language: 'ru', birthDate: undefined };
        if (!state.checkins) state.checkins = [];
        if (!state.journal)  state.journal  = [];
        if (!state.auth)     state.auth     = { isAuth: false, role: 'employee', onboardingDone: true, email: undefined };
        if (typeof state.user === 'undefined') state.user = null; // новое поле
        return state as State;
      },
      partialize: (s) => ({
        profile: s.profile,
        settings: s.settings,
        checkins: s.checkins,
        lastCheckIn: s.lastCheckIn,
        journal: s.journal,
        auth: s.auth,
        user: s.user, // сохраняем в storage
      }),
    }
  )
);

/* ---------- удобные селекторы для компонентов ---------- */
export const selectIsAuthed    = (s: State) => s.auth.isAuth;
export const selectUserName    = (s: State) => s.profile.name || 'Гость';
export const selectAvatarUrl   = (s: State) => s.profile.avatarUrl;

/** старая семантика (читает auth.role), оставляем для обратной совместимости */
export const selectRole        = (s: State) => s.auth.role;

/** новая семантика (читает активную роль из user, с fallback на auth.role) */
export const selectActiveRole  = (s: State) => s.user?.activeRole ?? s.auth.role;