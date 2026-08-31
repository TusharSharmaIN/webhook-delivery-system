const CORE_API_URL = import.meta.env.VITE_CORE_API_URL as string;
const RECEIVER_URL = import.meta.env.VITE_RECEIVER_URL as string;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // response wasn't JSON, keep the generic message
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const coreApi = {
  url: CORE_API_URL,
  get: <T>(path: string) => request<T>(`${CORE_API_URL}${path}`),
  post: <T>(path: string, body: unknown) =>
    request<T>(`${CORE_API_URL}${path}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  delete: <T>(path: string) =>
    request<T>(`${CORE_API_URL}${path}`, { method: "DELETE" }),
};

export const receiverApi = {
  url: RECEIVER_URL,
  get: <T>(path: string) => request<T>(`${RECEIVER_URL}${path}`),
  post: <T>(path: string, body: unknown) =>
    request<T>(`${RECEIVER_URL}${path}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
