// Reuse your app types (already defined in src/types.ts)
import type { FoodEntry, FoodItem, AmountUnit, MealType } from "../types";
import type { FormState } from "../types";

// ===== Server-side shapes =====
export type SFoodItem = {
  name: string;
  type: "Fruit" | "Carbohydrates" | "Protein" | "Vegetables";
  amount?: number;
  amountUnit?: "ml" | "g" | "tbsp" | "unit";
};

export type SEntry = {
  _id: string;
  date: string; // ISO
  items: SFoodItem[];
  typeOfMeal: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  amount?: number;
  amountUnit?: "ml" | "g" | "tbsp" | "unit";
  reaction?: string;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
};

export type SEntryCreate = Omit<SEntry, "_id" | "createdAt" | "updatedAt">;
export type SEntryUpdate = Partial<SEntryCreate>;

export type Paginated<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

// ===== Mappers =====
export function fromServerEntry(se: SEntry): FoodEntry {
  return {
    id: se._id,
    date: new Date(se.date),
    items: se.items.map((it) => ({ ...it } as FoodItem)),
    typeOfMeal: se.typeOfMeal as MealType,
    amount: se.amount,
    amountUnit: se.amountUnit as AmountUnit | undefined,
    reaction: se.reaction,
    rating: se.rating,
  };
}

export function toServerEntry(fe: FoodEntry): SEntryCreate {
  return {
    date: fe.date.toISOString(),
    items: fe.items.map((it) => ({
      name: it.name,
      type: it.type,
      amount: it.amount,
      amountUnit: it.amountUnit,
    })),
    typeOfMeal: fe.typeOfMeal,
    amount: fe.amount,
    amountUnit: fe.amountUnit,
    reaction: fe.reaction,
    rating: fe.rating,
  };
}

export function toServerEntryFromForm(form: FormState): SEntryCreate {
  return {
    date: (form.date as Date).toISOString(),
    items: form.items.map((it) => ({
      name: it.name.trim(),
      type: it.type,
      amount: typeof it.amount === "number" ? it.amount : 0,
      amountUnit: it.amountUnit,
    })),
    typeOfMeal: form.typeOfMeal as MealType,
    amount: form.amount || 0,
    amountUnit: form.amount === "" ? undefined : form.amountUnit || "ml",
    reaction: form.reaction || undefined,
    rating: form.rating,
  };
}
