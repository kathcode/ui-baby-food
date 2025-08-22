import {
  ENTRY_STORAGE_KEY,
  RECIPE_STORAGE_KEY,
  type FoodEntry,
  type FoodItem,
  type FoodType,
  type Recipe,
} from "../types";

export function loadEntries(): FoodEntry[] {
  try {
    const raw = localStorage.getItem(ENTRY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((e: any) => {
      const date = new Date(e.date);
      const items: FoodItem[] = Array.isArray(e.items)
        ? e.items.map((it: any) => ({
            name: String(it.name ?? ""),
            type: (it.type ?? "Fruit") as FoodType,
            amount: typeof it.amount === "number" ? it.amount : undefined,
            amountUnit: it.amountUnit,
          }))
        : [];
      return {
        id: String(e.id),
        date: isNaN(date.getTime()) ? new Date() : date,
        items,
        typeOfMeal: e.typeOfMeal,
        amount: typeof e.amount === "number" ? e.amount : undefined,
        amountUnit: e.amountUnit,
        reaction: typeof e.reaction === "string" ? e.reaction : undefined,
        rating: typeof e.rating === "number" ? e.rating : 0,
      } as FoodEntry;
    });
  } catch {
    return [];
  }
}

export function saveEntries(entries: FoodEntry[]) {
  try {
    const serializable = entries.map((e) => ({
      ...e,
      date: e.date.toISOString(),
    }));
    localStorage.setItem(ENTRY_STORAGE_KEY, JSON.stringify(serializable));
  } catch (err) {
    console.error("Failed to save entries:", err);
  }
}

export function loadRecipes(): Recipe[] {
  try {
    const raw = localStorage.getItem(RECIPE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((r: any) => ({
      id: String(r.id),
      name: String(r.name || ""),
      description:
        typeof r.description === "string" ? r.description : undefined, // NEW
      items: Array.isArray(r.items)
        ? r.items.map((it: any) => ({
            name: String(it.name ?? ""),
            type: it.type,
            amount: typeof it.amount === "number" ? it.amount : undefined,
            amountUnit: it.amountUnit,
          }))
        : [],
    })) as Recipe[];
  } catch {
    return [];
  }
}

export function saveRecipes(recipes: Recipe[]) {
  try {
    localStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(recipes));
  } catch (err) {
    console.error("Failed to save recipes:", err);
  }
}
