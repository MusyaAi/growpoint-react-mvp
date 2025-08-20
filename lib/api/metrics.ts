// lib/api/metrics.ts
import type { Id, MetricSnapshot } from './dto';
import { db, delay } from './__mocks__/db';
import * as Employees from './employees';

/** Обёртка: список сотрудников компании */
export const listEmployees = Employees.listEmployees;

/** Агрегированные метрики по компании (моки) */
export async function getAggregateMetrics(companyId: Id): Promise<MetricSnapshot> {
  await delay(160);
  const last = db.metrics.filter(m => m.companyId === companyId).slice(-1)[0];
  return last ?? {
    companyId,
    capturedAt: new Date().toISOString(),
    engagement: 60,
    stress: 40,
    participation: 50
  };
}
