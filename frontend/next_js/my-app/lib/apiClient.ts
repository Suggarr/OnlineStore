import { API_BASE } from './api';

export type ApiResponse<T> = { status: number; data: T | null };

async function parseJsonSafe(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    return text;
  }
}

async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;

  const finalOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  };

  let res: Response;
  try {
    res = await fetch(url, finalOptions);
  } catch (err) {
    throw new Error(`Сетевая ошибка: ${String(err)}`);
  }

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const message = (data && (data as any).message) || res.statusText || 'Неизвестная ошибка';
    const err = new Error(`Ошибка API ${res.status}: ${message}`);
    (err as any).status = res.status;
    (err as any).data = data;
    throw err;
  }

  return { status: res.status, data } as ApiResponse<T>;
}

export const apiClient = {
  get: <T = any>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T = any>(path: string, body?: any) =>
    request<T>(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }),
  patch: <T = any>(path: string, body?: any) =>
    request<T>(path, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }),
  put: <T = any>(path: string, body?: any) =>
    request<T>(path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }),
  del: <T = any>(path: string) => request<T>(path, { method: 'DELETE' }),
  raw: request,
};

export default apiClient;
