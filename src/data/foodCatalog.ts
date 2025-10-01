// src/data/foodCatalog.ts
import type { FoodType } from "../types";
import { normalizeFoodName } from "../utils/foods";

export type Catalog = Record<FoodType, string[]>;

const STORAGE_KEY = "food_catalog_custom_v1";

// Starter catalog (edit as you like)
const DEFAULT_CATALOG: Catalog = {
  Fruit: [
    "Apple",
    "Banana",
    "Pear",
    "Peach",
    "Mango",
    "Blueberries",
    "Strawberries",
    "Raspberries",
    "Watermelon",
    "Avocado",
    "Plum",
    "Kiwi",
  ],
  Carbohydrates: [
    "Oatmeal",
    "Rice",
    "Quinoa",
    "Sweet Potato",
    "Potato",
    "Pasta",
    "Bread",
    "Couscous",
  ],
  Protein: [
    "Chicken",
    "Turkey",
    "Beef",
    "Lentils",
    "Black Beans",
    "Egg",
    "Tofu",
    "Yogurt",
    "Fish",
  ],
  Vegetables: [
    "Carrot",
    "Peas",
    "Broccoli",
    "Cauliflower",
    "Zucchini",
    "Spinach",
    "Pumpkin",
    "Green Beans",
  ],
};

// Load merged catalog (default + custom additions)
export function loadCatalog(): Catalog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CATALOG;
    const custom: Catalog = JSON.parse(raw);
    const merged: Catalog = {
      Fruit: [],
      Carbohydrates: [],
      Protein: [],
      Vegetables: [],
    };
    (Object.keys(merged) as FoodType[]).forEach((type) => {
      const base = DEFAULT_CATALOG[type] ?? [];
      const extra = Array.isArray(custom[type]) ? custom[type] : [];
      // merge without dups (case-insensitive)
      const set = new Map<string, string>();
      [...base, ...extra].forEach((n) => {
        const key = normalizeFoodName(n);
        if (!set.has(key)) set.set(key, n.trim());
      });
      merged[type] = Array.from(set.values()).sort((a, b) =>
        a.localeCompare(b)
      );
    });
    return merged;
  } catch {
    return DEFAULT_CATALOG;
  }
}

// Save only custom delta (not the entire merged list)
export function saveCustomItem(type: FoodType, name: string) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const data: Catalog = raw
    ? JSON.parse(raw)
    : { Fruit: [], Carbohydrates: [], Protein: [], Vegetables: [] };
  const clean = name.trim();
  if (!clean) return;
  const exists = (data[type] || []).some(
    (n) => normalizeFoodName(n) === normalizeFoodName(clean)
  );
  if (!exists) {
    data[type] = [...(data[type] || []), clean];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}
