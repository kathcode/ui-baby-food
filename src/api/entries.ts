import { useAuthedFetch } from "./authedFetch";
import type { SEntry, SEntryCreate, SEntryUpdate } from "./types";

export type EntryListParams = {
  limit?: number;
  offset?: number;
  sort?: "newest" | "oldest" | "rating_desc" | "rating_asc";
  dateFrom?: string; // ISO
  dateTo?: string; // ISO
};

export const useEntriesApi = () => {
  const authRequest = useAuthedFetch();
  return {
    list: (p: EntryListParams = {}) =>
      authRequest(
        `/entries?` +
          new URLSearchParams({
            limit: String(p.limit ?? 50),
            offset: String(p.offset ?? 0),
            sort: String(p.sort ?? "newest"),
            ...(p.dateFrom ? { dateFrom: p.dateFrom } : {}),
            ...(p.dateTo ? { dateTo: p.dateTo } : {}),
          }).toString()
      ),

    get: (id: string) => authRequest<SEntry>(`/entries/${id}`),

    create: (payload: SEntryCreate) =>
      authRequest<SEntry>(`/entries`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    update: (id: string, payload: SEntryUpdate) =>
      authRequest<SEntry>(`/entries/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),

    remove: (id: string) =>
      authRequest<{ ok: boolean }>(`/entries/${id}`, { method: "DELETE" }),
  };
};
