// lib/api/http.ts
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function request<T>(path: string, method: HttpMethod, body?: unknown, token?: string): Promise<T> {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const http = {
  get:  <T>(path: string, token?: string) => request<T>(path, 'GET',  undefined, token),
  post: <T>(path: string, body?: unknown, token?: string) => request<T>(path, 'POST', body, token),
  put:  <T>(path: string, body?: unknown, token?: string) => request<T>(path, 'PUT',  body, token),
  patch:<T>(path: string, body?: unknown, token?: string) => request<T>(path, 'PATCH',body, token),
  del:  <T>(path: string, token?: string) => request<T>(path, 'DELETE',undefined, token),
};