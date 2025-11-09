import { useAuthedFetch } from "./authedFetch";
import { request } from "./client";
import type { Paginated } from "./types";

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

export interface SRecipe {
  _id: string;
  name: string;
  description?: string;
  items: SFoodItem[];
  createdAt?: string;
  updatedAt?: string;
}

export type SRecipeCreate = Omit<SRecipe, "_id" | "createdAt" | "updatedAt">;
export type SRecipeUpdate = Partial<SRecipeCreate>;

export const useRecipesApi = () => {
  const authRequest = useAuthedFetch();
  return {
    list: (p: EntryListParams = {}) =>
      authRequest<Paginated<SRecipe>>(
        `/recipes?` +
          new URLSearchParams({
            limit: String(p.limit ?? 50),
            offset: String(p.offset ?? 0),
            sort: String(p.sort ?? "newest"),
            ...(p.dateFrom ? { dateFrom: p.dateFrom } : {}),
            ...(p.dateTo ? { dateTo: p.dateTo } : {}),
          }).toString()
      ),

    get: (id: string) => request<SRecipe>(`/recipes/${id}`),

    create: (payload: SRecipeCreate) =>
      authRequest<SRecipe>(`/recipes`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    update: (id: string, payload: SRecipeUpdate) =>
      authRequest<SRecipe>(`/recipes/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),

    remove: (id: string) =>
      authRequest<{ ok: boolean }>(`/recipes/${id}`, { method: "DELETE" }),
  };
};
