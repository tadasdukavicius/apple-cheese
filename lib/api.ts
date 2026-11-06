import { API_BASE_URL } from './config';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  endpoint: string,
  body?: unknown,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Nepavyko prisijungti prie serverio. Pabandykite vėliau.');
  }

  if (!res.ok) {
    // API errors look like { error: { message, details? } }
    const payload = await res.json().catch(() => null);
    throw new ApiError(res.status, payload?.error?.message ?? 'Įvyko klaida. Bandykite dar kartą.');
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const fetchAPI = <T>(endpoint: string, token?: string) =>
  request<T>('GET', endpoint, undefined, token);

export const postAPI = <T>(endpoint: string, body: unknown, token?: string) =>
  request<T>('POST', endpoint, body, token);

export const patchAPI = <T>(endpoint: string, body: unknown, token?: string) =>
  request<T>('PATCH', endpoint, body, token);

export const deleteAPI = (endpoint: string, token?: string) =>
  request<void>('DELETE', endpoint, undefined, token);
