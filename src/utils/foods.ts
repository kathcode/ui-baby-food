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

// Narrowing helper for optional flag added by annotateNewFoods
export function hasNewFlag(it: unknown): it is { __isNew?: boolean } {
  return typeof it === "object" && it !== null && "__isNew" in it;
}

export const FOOD_TYPES = [
  "Fruit",
  "Carbohydrates",
  "Protein",
  "Vegetables",
] as const;

export const sortFood = (arr: any, sortBy: string) => {
  switch (sortBy) {
    case "newest":
      arr.sort((a, b) => b.date.getTime() - a.date.getTime());
      break;
    case "oldest":
      arr.sort((a, b) => a.date.getTime() - b.date.getTime());
      break;
    case "rating_desc":
      arr.sort(
        (a, b) =>
          (b.rating ?? 0) - (a.rating ?? 0) ||
          b.date.getTime() - a.date.getTime()
      );
      break;
    case "rating_asc":
      arr.sort(
        (a, b) =>
          (a.rating ?? 0) - (b.rating ?? 0) ||
          b.date.getTime() - a.date.getTime()
      );
      break;
  }

  return arr;
};
