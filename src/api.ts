// src/api.ts
export interface FoodItem {
  name: string;
  type: string;
  amount: number;
  unit: string;
}

export interface Entry {
  _id?: string;
  date: string;
  typeOfMeal: "breakfast" | "lunch" | "dinner" | "snack";
  items: FoodItem[];
  reaction?: string;
  rating: number;
}

export interface Recipe {
  _id?: string;
  name: string;
  description?: string;
  items: FoodItem[];
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Helper to handle responses
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || res.statusText);
  }
  return res.json();
}

export const api = {
  entries: {
    list: () => request<Entry[]>(`${API_BASE}/entries`),
    get: (id: string) => request<Entry>(`${API_BASE}/entries/${id}`),
    create: (data: Omit<Entry, "_id">) =>
      request<Entry>(`${API_BASE}/entries`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Entry>) =>
      request<Entry>(`${API_BASE}/entries/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`${API_BASE}/entries/${id}`, {
        method: "DELETE",
      }),
  },
  recipes: {
    list: () => request<Recipe[]>(`${API_BASE}/recipes`),
    get: (id: string) => request<Recipe>(`${API_BASE}/recipes/${id}`),
    create: (data: Omit<Recipe, "_id">) =>
      request<Recipe>(`${API_BASE}/recipes`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Recipe>) =>
      request<Recipe>(`${API_BASE}/recipes/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`${API_BASE}/recipes/${id}`, {
        method: "DELETE",
      }),
  },
};
