// lib/ds/emotions.ts

export type EmotionFamily =
  | 'joy' | 'sadness' | 'fear' | 'anger' | 'disgust'
  | 'surprise' | 'love' | 'shame' | 'guilt' | 'calm';

export const FAMILY_LABEL_RU: Record<EmotionFamily, string> = {
  joy: 'радость',
  sadness: 'грусть',
  fear: 'страх',
  anger: 'злость',
  disgust: 'отвращение',
  surprise: 'удивление',
  love: 'любовь',
  shame: 'стыд',
  guilt: 'вина',
  calm: 'спокойствие',
};

const FAMILY_COLOR: Record<EmotionFamily, string> = {
  joy: '#22c55e',
  sadness: '#60a5fa',
  fear: '#f59e0b',
  anger: '#ef4444',
  disgust: '#10b981',
  surprise: '#a78bfa',
  love: '#f472b6',
  shame: '#fb7185',
  guilt: '#94a3b8',
  calm: '#14b8a6',
};

export type Emotion = {
  id: string;        // стабильный id
  slug: string;      // человекочитаемый slug
  title: string;     // название (RU)
  subtitle?: string; // краткое описание
  family: EmotionFamily;
  emoji: string;
  color: string;     // цвет семейства
  tags?: string[];   // мини-теги/маркеры
};

function make(
  slug: string,
  title: string,
  family: EmotionFamily,
  emoji: string,
  subtitle?: string,
  tags: string[] = []
): Emotion {
  return {
    id: slug,
    slug,
    title,
    family,
    emoji,
    color: FAMILY_COLOR[family],
    subtitle,
    tags,
  };
}

// === 33 карточки (RU) ===
export const emotions: Emotion[] = [
  // JOY
  make('radost', 'Радость', 'joy', '😊', 'Состояние энергии и соединённости.', ['тёпло', 'лёгкость']),
  make('vostorg', 'Восторг', 'joy', '🤩', 'Пик переживания радости.', ['сила', 'расширение']),
  make('voodushevlenie', 'Воодушевление', 'joy', '✨', 'Прилив вдохновения и сил.', ['интерес']),
  make('legkost', 'Лёгкость', 'joy', '😌', 'Свобода, отсутствие напряжения.', ['простор']),

  // SADNESS
  make('grust', 'Грусть', 'sadness', '😔', 'Тихая печаль о важном.', ['замедление']),
  make('toska', 'Тоска', 'sadness', '🥀', 'Потеря контакта/смысла.', ['опустошение']),
  make('ogorchenie', 'Огорчение', 'sadness', '😞', 'Разочарование ожиданий.', ['слёзы']),
  make('razocharovanie', 'Разочарование', 'sadness', '😕', 'Несовпадение «как хотелось».', ['падение']),

  // FEAR
  make('trevoga', 'Тревога', 'fear', '😟', 'Фон о возможной угрозе.', ['неопределённость']),
  make('opasenie', 'Опасение', 'fear', '😬', 'Ожидание конкретного риска.', ['напряжение']),
  make('ispug', 'Испуг', 'fear', '😳', 'Резкая реакция на неожиданное.', ['вздрогнуть']),
  make('neuverennost', 'Неуверенность', 'fear', '🤔', 'Сомнение в своих шагах.', ['осторожность']),

  // ANGER
  make('zlost', 'Злость', 'anger', '😠', 'Граница/ценность нарушены.', ['тепло', 'напор']),
  make('razdrazhenie', 'Раздражение', 'anger', '😤', 'Мелкие нарушения границ.', ['шероховатость']),
  make('yarost', 'Ярость', 'anger', '😡', 'Сильная энергия защиты.', ['взрыв']),
  make('obida', 'Обида', 'anger', '😒', 'Боль от несправедливости.', ['дистанция']),

  // DISGUST
  make('otvrashchenie', 'Отвращение', 'disgust', '🤢', 'Резкое «не хочу/не моё».', ['отталкивание']),
  make('brezglivost', 'Брезгливость', 'disgust', '🤮', 'Сильное неприятие.', ['удалить']),
  make('prezrenie', 'Презрение', 'disgust', '😒', 'Снижение ценности другого.', ['холод']),

  // SURPRISE
  make('udivlenie', 'Удивление', 'surprise', '😮', 'Новая информация/разрыв ожиданий.', ['стоп-кадр']),
  make('izumlenie', 'Изумление', 'surprise', '🤯', 'Сильный эффект неожиданности.', ['вау']),
  make('oshelomlenie', 'Ошеломление', 'surprise', '😵', 'Поток неожиданностей.', ['ступор']),

  // LOVE
  make('lubov', 'Любовь', 'love', '❤️', 'Тёплая связь и принятие.', ['сопричастность']),
  make('nezhnost', 'Нежность', 'love', '🥰', 'Мягкое внимание/забота.', ['тепло']),
  make('privyazannost', 'Привязанность', 'love', '🤝', 'Стабильная близость.', ['надёжность']),
  make('doverie', 'Доверие', 'love', '🫶', 'Готовность опираться на другого.', ['открытость']),
  make('blagodarnost', 'Благодарность', 'love', '🙏', 'Замечаю ценность и говорю «спасибо».', ['щедрость']),

  // SHAME
  make('styd', 'Стыд', 'shame', '😳', 'Чувство разоблачения/несоответствия.', ['жар в лице', 'сжаться']),
  make('nelovkost', 'Неловкость', 'shame', '😅', '«Как-то не так сделал/сказал».', ['застенчивость']),
  make('unizhenie', 'Унижение', 'shame', '🥲', 'Опыт обесценивания другого.', ['боль']),

  // GUILT
  make('vina', 'Вина', 'guilt', '😖', 'Я причинил вред/нарушил договорённость.', ['исправить']),
  make('raskayanie', 'Раскаяние', 'guilt', '😔', 'Хочу извиниться и восстановить.', ['мириться']),
  make('sovestlivost', 'Совестливость', 'guilt', '🫤', 'Чувствительность к нормам/этике.', ['задумчивость']),

  // CALM
  make('spokoystvie', 'Спокойствие', 'calm', '🙂', 'Ровность и собранность.', ['дыхание']),
  make('umirotvorenie', 'Умиротворение', 'calm', '🕊️', 'Глубинный покой и принятие.', ['тишина']),
  make('sderzhannost', 'Сдержанность', 'calm', '🤐', 'Умение дозировать выражение.', ['рамки']),
  make('prinyatie', 'Принятие', 'calm', '🤲', 'Согласие с реальностью как она есть.', ['мягкость']),
];

// --- helpers ---------------------------------------------------------------

export function familyLabelRu(f: EmotionFamily): string {
  return FAMILY_LABEL_RU[f];
}

export function listEmotions(params?: {
  search?: string;
  family?: EmotionFamily | '';
  limit?: number;
  offset?: number;
}): Emotion[] {
  const search = (params?.search || '').trim().toLowerCase();
  const family = (params?.family || '') as EmotionFamily | '';
  const limit  = Math.max(1, Math.min(100, params?.limit ?? 48));
  const offset = Math.max(0, params?.offset ?? 0);

  let items = emotions.slice();

  if (family) items = items.filter(i => i.family === family);
  if (search) {
    items = items.filter(i =>
      i.title.toLowerCase().includes(search) ||
      (i.subtitle || '').toLowerCase().includes(search) ||
      (i.tags || []).some(t => t.toLowerCase().includes(search))
    );
  }

  return items.slice(offset, offset + limit);
}

export function byIdOrSlug(slug: string): Emotion | undefined {
  return emotions.find(e => e.id === slug || e.slug === slug);
}
// ---- RICH glue -------------------------------------------------------------

import type { RichEmotionDoc } from './emotions.rich/types';
import { getRichBySlug } from './emotions.rich';

export type EmotionRich = Emotion & Partial<Omit<RichEmotionDoc, 'slug'>>;

export function getEmotionRich(slugOrId: string): EmotionRich | undefined {
  const base = byIdOrSlug(slugOrId);
  if (!base) return undefined;

  const rich = getRichBySlug(base.slug);
  if (!rich) return base as EmotionRich;

  const { slug: _drop, ...rest } = rich;
  return { ...base, ...rest } as EmotionRich;
}