export type FoodType = "Fruit" | "Carbohydrates" | "Protein" | "Vegetables";
export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";
export type AmountUnit = "ml" | "g" | "tbsp" | "unit";
export type SortKey = "newest" | "oldest" | "rating_desc" | "rating_asc";

export interface FoodItem {
  name: string;
  type: FoodType;
  amount?: number;
  amountUnit?: AmountUnit;
}

export interface FoodEntry {
  id: string;
  date: Date;
  items: FoodItem[];
  typeOfMeal: MealType;
  amount?: number;
  amountUnit?: AmountUnit;
  reaction?: string;
  rating: number;
}

export const FOOD_OPTIONS: FoodType[] = [
  "Fruit",
  "Carbohydrates",
  "Protein",
  "Vegetables",
];
export const MEAL_OPTIONS: MealType[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
];
export const UNIT_OPTIONS: AmountUnit[] = ["ml", "g", "tbsp", "unit"];

export const STORAGE_KEY = "food_log_entries_v4";

export type Mode = "create" | "edit";

export interface FormState {
  date: Date | null;
  items: FoodItem[];
  typeOfMeal: "" | MealType;
  amount: number | "";
  amountUnit: "" | AmountUnit;
  reaction: string;
  rating: number;
}

export const emptyForm: FormState = {
  date: null,
  items: [{ name: "", type: "Fruit" }],
  typeOfMeal: "",
  amount: "",
  amountUnit: "",
  reaction: "",
  rating: 0,
};

// ADD these exports
export interface Recipe {
  id: string;
  name: string;
  items: FoodItem[];
  description?: string;
}

export const RECIPE_STORAGE_KEY = "food_log_recipes_v1";
export const ENTRY_STORAGE_KEY = "food_log_entries_v4";
