// data/emotions.ts
export type EmotionFamily =
  | 'Радость' | 'Грусть' | 'Тревога' | 'Злость' | 'Стыд/Вина' | 'Интерес';

export type EmotionListItem = {
  id: string;
  slug: string;           // для URL
  title: string;          // «Стыд»
  family: EmotionFamily;
  summary?: string;
  color?: string;         // хекс/токен
};

export type EmotionFull = EmotionListItem & {
  immersion?: string;     // художественное погружение
  definition?: string;
  triggers?: string[];
  autoThoughts?: string[];
  somatics?: string[];
  behaviors?: string[];
  impact?: {
    communication?: string[];
    leadership?: string[];
    self?: string[];
  };
  selfTalk?: string[];    // фразы поддержки
  practices?: string[];   // микропрактики
  createdAt?: string;
  updatedAt?: string;
};

export const emotions: EmotionFull[] = [
  {
    id: 'e-shame', slug: 'styd', title: 'Стыд', family: 'Стыд/Вина',
    color: '#B45309',
    summary: 'Когда хочется исчезнуть и спрятаться.',
    immersion:
`Я стою, и мне кажется, что время сдвинулось на полшага в сторону...
(сюда вставлен твой полный текст «Погружение в СТЫД» — можно расширять)`,
    definition: 'Стыд — эмоция разоблачения и несоответствия внутренним/внешним стандартам.',
    triggers: ['Ошибка на виду','Сравнение с другими','Отсутствие поддержки при уязвимости'],
    autoThoughts: ['Они решат, что я некомпетентна','Скоро меня «раскусят»'],
    somatics: ['Жар в лице','Сжатие в груди','Напряжение челюсти'],
    behaviors: ['Замолкать','Оправдываться','Атаковать, чтобы отвлечь внимание'],
    impact: {
      communication: ['Боишься задавать вопросы','Уходишь в формальности'],
      leadership:    ['Перестраховка','Избегание сложных разговоров'],
      self:          ['Фон «я недостаточна»','Снижение самоценности'],
    },
    selfTalk: ['Я человек. Могу ошибаться. Это не делает меня плохой.'],
    practices: ['Глубокий выдох + вода','Назвать стыд стыдом','Мягкое прикосновение к груди'],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  { id: 'e-joy',   slug: 'radost', title: 'Радость', family: 'Радость', color: '#059669',
    summary: 'Тепло, расширение и желание делиться.' },
  { id: 'e-fear',  slug: 'strah',  title: 'Страх',  family: 'Тревога', color: '#2563EB',
    summary: 'Про риск и безопасность.' },
  { id: 'e-anger', slug: 'zlost',  title: 'Злость', family: 'Злость', color: '#DC2626',
    summary: 'Про границы и «что мне важно».' },
  // добавим позже остальные 28 карточек по кругу эмоций
];

export function byIdOrSlug(idOrSlug: string): EmotionFull | undefined {
  return emotions.find(e => e.id === idOrSlug || e.slug === idOrSlug);
}