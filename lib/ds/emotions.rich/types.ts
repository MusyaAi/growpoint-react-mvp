// lib/ds/emotions.rich/types.ts
export type RichBlocks = {
  immersion?: string[];
  definition?: string;
  triggers?: string[];
  autoThoughts?: string[];
  somatic?: string[];
  behaviors?: string[];
  impact?: {
    communication?: string[];
    leadership?: string[];
    selfPerception?: string[];
  };
  selfSupport?: string[];
  microPractice?: string[];
};

export type RichEmotionDoc = {
  slug: string;              // должен совпадать со slug базовой эмоции
} & RichBlocks;