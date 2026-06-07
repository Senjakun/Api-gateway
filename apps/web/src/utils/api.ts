const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function apiFetch(
  path: string,
  options?: RequestInit
): Promise<any> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `HTTP ${res.status}`);
  }

  // Some endpoints may return no content
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
