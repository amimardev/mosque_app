import { apiRequestFn } from '../server/functions/api';

type RequestConfig = { params?: Record<string, string | number | boolean | null | undefined>; headers?: Record<string, string> };
type ApiResponse<T = any> = { data: T; status: number; headers?: Record<string, string> };

function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

async function serializeBody(body: unknown): Promise<unknown> {
  if (!(body instanceof FormData)) return body;
  const values: Record<string, unknown> = {};
  for (const [key, value] of body.entries()) {
    if (value instanceof Blob) {
      values[key] = {
        name: value instanceof File ? value.name : 'upload',
        type: value.type,
        base64: encodeBase64(new Uint8Array(await value.arrayBuffer())),
      };
    } else {
      values[key] = value;
    }
  }
  return values;
}

async function request<T>(method: string, rawUrl: string, body?: unknown, config: RequestConfig = {}): Promise<ApiResponse<T>> {
  const url = new URL(rawUrl, typeof window === 'undefined' ? 'http://localhost' : window.location.origin);
  for (const [key, value] of Object.entries(config.params ?? {})) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }

  if (url.origin !== (typeof window === 'undefined' ? 'http://localhost' : window.location.origin)) {
    const response = await fetch(url, {
      method,
      headers: config.headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw Object.assign(new Error(data?.error || response.statusText), { response: { data, status: response.status } });
    return { data, status: response.status };
  }

  const query = Object.fromEntries(url.searchParams.entries());
  const result = await apiRequestFn({
    data: {
      method: method as 'GET' | 'POST' | 'PUT' | 'DELETE',
      path: url.pathname,
      query,
      body: await serializeBody(body),
    },
  });
  const response = { data: result.body as T, status: result.status, headers: result.headers };
  if (result.status >= 400) {
    const message = (result.body as { error?: string } | null)?.error || `Request failed (${result.status})`;
    throw Object.assign(new Error(message), { response });
  }
  return response;
}

const api = {
  get: <T = any>(url: string, config?: RequestConfig) => request<T>('GET', url, undefined, config),
  post: <T = any>(url: string, body?: unknown, config?: RequestConfig) => request<T>('POST', url, body, config),
  put: <T = any>(url: string, body?: unknown, config?: RequestConfig) => request<T>('PUT', url, body, config),
  delete: <T = any>(url: string, config?: RequestConfig) => request<T>('DELETE', url, undefined, config),
};

export default api;
