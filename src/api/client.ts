const API_BASE =
  import.meta.env.VITE_API_URL || "https://api-baby-food.onrender.com/api";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    let err: any = {};
    try {
      err = await res.json();
    } catch {}
    throw new Error(err?.error || res.statusText);
  }
  return res.json();
}
