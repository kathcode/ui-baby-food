export type FoodType = "Fruit" | "Carbohydrates" | "Protein" | "Vegetables";
export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";
export type AmountUnit = "ml" | "g" | "tbsp" | "unit";

export interface FoodEntry {
  id: string;
  date: Date;
  typeOfFood: FoodType;
  typeOfMeal: MealType;
  amount?: number;
  amountUnit?: AmountUnit;
  reaction?: string;
  bebeLikes: boolean;
  rating?: number; // ⭐ New
}
