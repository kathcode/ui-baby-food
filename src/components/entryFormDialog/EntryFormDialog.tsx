import { useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Rating,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { DatePicker } from "@mui/x-date-pickers";
import {
  FOOD_OPTIONS,
  MEAL_OPTIONS,
  UNIT_OPTIONS,
  type FoodItem,
  type FormState,
  type Mode,
  type MealType,
  type FoodType,
  type AmountUnit,
} from "../../types";

export function EntryFormDialog({
  open,
  mode,
  form,
  setForm,
  onClose,
  onSubmit,
  onSaveRecipe, // NEW
}: {
  open: boolean;
  mode: Mode;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onClose: () => void;
  onSubmit: () => void;
  onSaveRecipe: () => void; // NEW
}) {
  const isValid = useMemo(() => {
    const hasItems =
      form.items.length > 0 &&
      form.items.every(
        (it) =>
          it.name.trim() &&
          it.type &&
          (typeof it.amount !== "number" || !!it.amountUnit) // if amount, require unit
      );
    return Boolean(form.date && form.typeOfMeal && hasItems && form.rating > 0);
  }, [form]);

  const updateItem = (idx: number, patch: Partial<FoodItem>) =>
    setForm((f) => ({
      ...f,
      ...patch,
      items: f.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }));

  const addRow = () =>
    setForm((f) => ({
      ...f,
      items: [
        ...f.items,
        { name: "", type: "Fruit", amount: undefined, amountUnit: undefined },
      ],
    }));

  const removeRow = (idx: number) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const handleSaveRecipe = () => {
    const ingredientsList = form.items
      .map((it) => ({
        name: it.name.trim(),
        type: it.type,
        amount: typeof it.amount === "number" ? it.amount : undefined,
        amountUnit: it.amountUnit,
      }))
      .filter((it) => it.name);
    if (ingredientsList.length === 0) return;
    onSaveRecipe();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {mode === "create" ? "Add Food Entry" : "Edit Food Entry"}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "grid", gap: 2, mt: 0.5 }}>
          <DatePicker
            label="Date"
            value={form.date}
            onChange={(value) =>
              setForm((f) => ({ ...f, date: value || null }))
            }
            slotProps={{ textField: { required: true, fullWidth: true } }}
          />

          <FormControl fullWidth required>
            <InputLabel id="meal-type-label">Type of Meal</InputLabel>
            <Select
              labelId="meal-type-label"
              label="Type of Meal"
              value={form.typeOfMeal}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  typeOfMeal: e.target.value as MealType,
                }))
              }
            >
              {MEAL_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Foods header with buttons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle2">Ingredients *</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={handleSaveRecipe}
              >
                Save as Recipe
              </Button>
              <Button size="small" onClick={addRow}>
                Add another
              </Button>
            </Box>
          </Box>

          {/* Rows: Name + Type + Amount + Unit + remove */}
          {form.items.map((it, idx) => (
            <Grid container spacing={2} key={idx} alignItems="center">
              <Grid size={6}>
                <TextField
                  label="Name"
                  value={it.name}
                  onChange={(e) => updateItem(idx, { name: e.target.value })}
                  fullWidth
                />
              </Grid>

              <Grid size={6}>
                <FormControl fullWidth>
                  <InputLabel id={`food-type-${idx}`}>Type</InputLabel>
                  <Select
                    labelId={`food-type-${idx}`}
                    label="Type"
                    value={it.type}
                    onChange={(e) =>
                      updateItem(idx, { type: e.target.value as FoodType })
                    }
                  >
                    {FOOD_OPTIONS.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={6}>
                <TextField
                  label="Amount"
                  type="number"
                  inputProps={{ min: 0, step: 1 }}
                  value={typeof it.amount === "number" ? it.amount : ""}
                  onChange={(e) =>
                    updateItem(idx, {
                      amount:
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      ...(e.target.value === ""
                        ? { amountUnit: undefined }
                        : {}),
                    })
                  }
                  placeholder="e.g., 60"
                  fullWidth
                />
              </Grid>

              <Grid size={6}>
                <FormControl fullWidth disabled={typeof it.amount !== "number"}>
                  <InputLabel id={`unit-${idx}`}>Unit</InputLabel>
                  <Select
                    labelId={`unit-${idx}`}
                    label="Unit"
                    value={
                      typeof it.amount === "number" ? it.amountUnit || "" : ""
                    }
                    onChange={(e) =>
                      updateItem(idx, {
                        amountUnit: e.target.value as AmountUnit,
                      })
                    }
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <MenuItem key={u} value={u}>
                        {u}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid
                size={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {form.items.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => removeRow(idx)}
                    aria-label="remove row"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}

          {/* Optional overall amount + unit for the whole entry (keep if you use it) */}
          {/* ... you can leave your existing overall Amount fields here if desired ... */}

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography component="legend">Rating *</Typography>
            <Rating
              name="food-rating"
              value={form.rating}
              onChange={(_, newValue) =>
                setForm((f) => ({ ...f, rating: newValue || 0 }))
              }
            />
          </Box>
          {form.rating === 0 && (
            <Typography variant="caption" color="error">
              Please select a rating.
            </Typography>
          )}

          <TextField
            label="Reaction"
            placeholder="Notes or reactions"
            value={form.reaction}
            onChange={(e) =>
              setForm((f) => ({ ...f, reaction: e.target.value }))
            }
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit} disabled={!isValid}>
          {mode === "create" ? "Save" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
