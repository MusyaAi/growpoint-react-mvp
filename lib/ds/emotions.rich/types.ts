// lib/ds/emotions.rich/types.ts

// Медиа-блоки, которые можно прикрепить к подробному описанию эмоции
export type RichEmotionMedia = {
  image?: string;   // путь к иллюстрации, напр.: "/emotions/styd/illustration.png"
  audio?: string;   // путь к аудио, напр.: "/emotions/styd/immersion.m4a"
  video?: string;   // если решим добавить видео
  caption?: string; // подпись/описание медиа
  credits?: string; // автор/лицензия и т.п.
};

// Содержательные блоки карточки
export type RichBlocks = {
  immersion?: string[];  // художественное погружение (абзацы)
  definition?: string;   // суть/определение
  triggers?: string[];   // типичные триггеры
  autoThoughts?: string[]; // автоматические мысли
  somatic?: string[];    // телесные маркеры
  behaviors?: string[];  // поведенческие реакции
  impact?: {
    communication?: string[];
    leadership?: string[];
    selfPerception?: string[];
  };
  selfSupport?: string[];   // фразы самоподдержки
  microPractice?: string[]; // микропрактика / ритуал

  // новый блок для медиа
  media?: RichEmotionMedia;
};

// Полный документ подробностей для одной эмоции
export type RichEmotionDoc = {
  slug: string; // должен совпадать со slug базовой эмоции
} & RichBlocks;