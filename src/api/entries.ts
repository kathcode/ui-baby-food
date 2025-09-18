import { request } from "./client";
import type { Paginated, SEntry, SEntryCreate, SEntryUpdate } from "./types";

export type EntryListParams = {
  limit?: number;
  offset?: number;
  sort?: "newest" | "oldest" | "rating_desc" | "rating_asc";
  dateFrom?: string; // ISO
  dateTo?: string; // ISO
};

export const entriesApi = {
  list: (p: EntryListParams = {}) =>
    request<Paginated<SEntry>>(
      `/entries?` +
        new URLSearchParams({
          limit: String(p.limit ?? 50),
          offset: String(p.offset ?? 0),
          sort: String(p.sort ?? "newest"),
          ...(p.dateFrom ? { dateFrom: p.dateFrom } : {}),
          ...(p.dateTo ? { dateTo: p.dateTo } : {}),
        }).toString()
    ),

  get: (id: string) => request<SEntry>(`/entries/${id}`),

  create: (payload: SEntryCreate) =>
    request<SEntry>(`/entries`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: SEntryUpdate) =>
    request<SEntry>(`/entries/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  remove: (id: string) =>
    request<{ ok: boolean }>(`/entries/${id}`, { method: "DELETE" }),
};
