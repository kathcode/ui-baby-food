import { request } from "./client";
import type { Paginated, SEntry, SEntryCreate, SEntryUpdate } from "./types";

export type EntryListParams = {
  limit?: number;
  offset?: number;
  sort?: "newest" | "oldest" | "rating_desc" | "rating_asc";
  dateFrom?: string; // ISO
  dateTo?: string; // ISO
};

// ---- server shapes ----
export type SFoodItem = {
  name: string;
  type: "Fruit" | "Carbohydrates" | "Protein" | "Vegetables";
  amount?: number;
  amountUnit?: "ml" | "g" | "tbsp" | "unit";
};

export type SRecipe = {
  _id: string;
  name: string;
  description?: string;
  items: SFoodItem[];
  createdAt?: string;
  updatedAt?: string;
};

export const recipesApi = {
  list: (p: EntryListParams = {}) =>
    request<Paginated<SEntry>>(
      `/recipes?` +
        new URLSearchParams({
          limit: String(p.limit ?? 50),
          offset: String(p.offset ?? 0),
          sort: String(p.sort ?? "newest"),
          ...(p.dateFrom ? { dateFrom: p.dateFrom } : {}),
          ...(p.dateTo ? { dateTo: p.dateTo } : {}),
        }).toString()
    ),

  get: (id: string) => request<SEntry>(`/recipes/${id}`),

  create: (payload: SEntryCreate) =>
    request<SEntry>(`/recipes`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: SEntryUpdate) =>
    request<SEntry>(`/recipes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  remove: (id: string) =>
    request<{ ok: boolean }>(`/recipes/${id}`, { method: "DELETE" }),
};
