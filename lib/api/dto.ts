// lib/api/dto.ts
import type { Role } from '../models/roles';

/** Общие идентификаторы */
export type Id = string;
export type ISODate = string;

/** Компания (тенант) */
export interface CompanyDTO {
  id: Id;
  name: string;
  domain?: string;           // например, company.com
  createdAt: ISODate;
  seats?: number;            // лицензии
}

/** Пользователь компании */
export interface EmployeeDTO {
  id: Id;
  companyId: Id;
  email: string;
  name?: string;
  roles: Role[];
  status: 'active' | 'invited' | 'disabled';
  createdAt: ISODate;
}

/** Учебный модуль/курс */
export interface ModuleDTO {
  id: Id;
  title: string;
  level: 1 | 2 | 3 | 4;      // уровни развития
  tags?: string[];
  active: boolean;
  createdAt: ISODate;
}

/** Трек обучения (набор модулей) */
export interface TrackDTO {
  id: Id;
  title: string;
  moduleIds: Id[];
  createdAt: ISODate;
}

/** Пример агрегированной метрики для HR-дашборда */
export interface MetricSnapshot {
  companyId: Id;
  capturedAt: ISODate;
  engagement: number;   // 0..100
  stress: number;       // 0..100 (ниже — лучше)
  participation: number;// % активности
}
