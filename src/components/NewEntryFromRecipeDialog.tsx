import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Rating,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { AmountUnit, MealType, Recipe } from "../types";
import { MEAL_OPTIONS, UNIT_OPTIONS } from "../types";

export interface NewEntryFromRecipePayload {
  recipeId: string;
  date: Date;
  typeOfMeal: MealType;
  rating: number;
  reaction?: string;
  amount?: number;
  amountUnit?: AmountUnit;
}

export function NewEntryFromRecipeDialog({
  open,
  recipes,
  onClose,
  onSubmit,
}: {
  open: boolean;
  recipes: Recipe[];
  onClose: () => void;
  onSubmit: (payload: NewEntryFromRecipePayload) => void;
}) {
  const [recipeId, setRecipeId] = useState<string>("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [typeOfMeal, setTypeOfMeal] = useState<"" | MealType>("");
  const [rating, setRating] = useState<number>(0);
  const [reaction, setReaction] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [amountUnit, setAmountUnit] = useState<AmountUnit | "">("");

  const canSubmit = useMemo(
    () => Boolean(recipeId && date && typeOfMeal && rating > 0),
    [recipeId, date, typeOfMeal, rating]
  );

  const selected = recipes.find((r) => r.id === recipeId);

  const handleConfirm = () => {
    if (!canSubmit || !date || !typeOfMeal) return;
    onSubmit({
      recipeId,
      date,
      typeOfMeal,
      rating,
      reaction: reaction || undefined,
      amount: amount === "" ? undefined : Number(amount),
      amountUnit: amount === "" ? undefined : amountUnit || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New Entry from Recipe</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "grid", gap: 2, mt: 0.5 }}>
          <FormControl fullWidth required>
            <InputLabel id="recipe-select-label">Recipe</InputLabel>
            <Select
              labelId="recipe-select-label"
              label="Recipe"
              value={recipeId}
              onChange={(e) => setRecipeId(e.target.value as string)}
            >
              {recipes.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name || "Untitled recipe"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selected && (
            <Typography variant="body2" color="text.secondary">
              Items:&nbsp;
              {selected.items.length === 0
                ? "No items"
                : selected.items
                    .map((it) => {
                      const qty =
                        typeof it.amount === "number"
                          ? ` — ${it.amount}${
                              it.amountUnit ? ` ${it.amountUnit}` : ""
                            }`
                          : "";
                      return `${it.name} (${it.type})${qty}`;
                    })
                    .join(", ")}
            </Typography>
          )}

          <DatePicker
            label="Date"
            value={date}
            onChange={(v) => setDate(v || null)}
            slotProps={{ textField: { required: true, fullWidth: true } }}
          />

          <FormControl fullWidth required>
            <InputLabel id="meal-type-label">Type of Meal</InputLabel>
            <Select
              labelId="meal-type-label"
              label="Type of Meal"
              value={typeOfMeal}
              onChange={(e) => setTypeOfMeal(e.target.value as MealType)}
            >
              {MEAL_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <TextField
                label="Total Amount (optional)"
                type="number"
                inputProps={{ min: 0, step: 1 }}
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="e.g., 120"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth disabled={amount === ""}>
                <InputLabel id="unit-label">Unit</InputLabel>
                <Select
                  labelId="unit-label"
                  label="Unit"
                  value={amount === "" ? "" : amountUnit}
                  onChange={(e) => setAmountUnit(e.target.value as AmountUnit)}
                >
                  {UNIT_OPTIONS.map((u) => (
                    <MenuItem key={u} value={u}>
                      {u}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography component="legend">Rating *</Typography>
            <Rating value={rating} onChange={(_, v) => setRating(v || 0)} />
          </Box>
          {rating === 0 && (
            <Typography variant="caption" color="error">
              Please select a rating.
            </Typography>
          )}

          <TextField
            label="Reaction (optional)"
            value={reaction}
            onChange={(e) => setReaction(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!canSubmit}
        >
          Create Entry
        </Button>
      </DialogActions>
    </Dialog>
  );
}
