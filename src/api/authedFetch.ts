import { useAuth } from "@clerk/clerk-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/** Hook returning a fetch wrapper with Clerk token set automatically */
export function useAuthedFetch() {
  const { getToken } = useAuth();
  return async function authedFetch<T>(
    path: string,
    init?: RequestInit
  ): Promise<T> {
    const token = await getToken(); // if you use Clerk JWT templates: getToken({ template: 'default' })
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(init?.headers || {}),
      },
      credentials: "include", // safe if you also use cookies later
    });
    if (!res.ok) {
      let err: any = {};
      try {
        err = await res.json();
      } catch {}
      throw new Error(err?.error || res.statusText);
    }
    return res.json();
  };
}
