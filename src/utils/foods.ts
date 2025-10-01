import type { FoodEntry } from "../types";

export function normalizeFoodName(name: string) {
  return name.trim().toLowerCase();
}

/** Set of all distinct foods BEFORE the cutoff date (exclusive) */
export function knownFoodsBefore(entries: FoodEntry[], cutoff: Date) {
  const set = new Set<string>();
  entries.forEach((e) => {
    if (e.date < cutoff) {
      e.items.forEach((it) => set.add(normalizeFoodName(it.name)));
    }
  });
  return set;
}

/** Add __isNew flag to each item if it hasn't appeared before the cutoff */
export function annotateNewFoods<T extends FoodEntry>(
  entries: T[],
  cutoff: Date
): T[] {
  const known = knownFoodsBefore(entries, cutoff);
  return entries.map((e) => ({
    ...e,
    items: e.items.map((it) => ({
      ...it,
      __isNew: !known.has(normalizeFoodName(it.name)), // 👈 used by UI
    })) as any,
  }));
}

export function buildTriedKey(name: string, type: string) {
  return `${normalizeFoodName(name)}|${type.toLowerCase()}`;
}

/** Distinct tried keys (name|type) over all entries */
export function triedKeySet(entries: FoodEntry[]) {
  const s = new Set<string>();
  for (const e of entries) {
    for (const it of e.items) s.add(buildTriedKey(it.name, it.type));
  }
  return s;
}
