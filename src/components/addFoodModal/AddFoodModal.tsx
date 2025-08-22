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
  Rating,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { AmountUnit, FoodType, MealType } from "../../shared/types";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const FOOD_OPTIONS: FoodType[] = [
  "Fruit",
  "Carbohydrates",
  "Protein",
  "Vegetables",
];
const MEAL_OPTIONS: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];
const UNIT_OPTIONS: AmountUnit[] = ["ml", "g", "tbsp", "unit"];

export const AddFoodModal = ({
  open,
  mode,
  setOpen,
  form,
  setForm,
  addRow,
  updateItem,
  removeRow,
  isValid,
  handleSave,
}) => (
  <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
    <DialogTitle>
      {mode === "create" ? "Add Food Entry" : "Edit Food Entry"}
    </DialogTitle>
    <DialogContent sx={{ pt: 2 }}>
      <Box sx={{ display: "grid", gap: 2, mt: 0.5 }}>
        <DatePicker
          label="Date"
          value={form.date}
          onChange={(value) => setForm((f) => ({ ...f, date: value || null }))}
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

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle2">Ingredients *</Typography>
          <Button size="small" onClick={addRow}>
            Add another
          </Button>
        </Box>

        {form.items.map((it, idx) => (
          <Grid container spacing={2} key={idx} alignItems="center">
            <Grid item xs={12} sm={7}>
              <TextField
                label="Name"
                value={it.name}
                onChange={(e) => updateItem(idx, { name: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
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
            <Grid
              item
              xs={12}
              sm={1}
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

        <Grid container spacing={2}>
          <Grid item xs={12} sm={7}>
            <TextField
              label="Amount"
              type="number"
              inputProps={{ min: 0, step: 1 }}
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  amount: e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
              placeholder="e.g., 120"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth disabled={form.amount === ""}>
              <InputLabel id="unit-label">Unit</InputLabel>
              <Select
                sx={{ minWidth: 100 }}
                labelId="unit-label"
                label="Unit"
                value={form.amount === "" ? "" : form.amountUnit}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    amountUnit: e.target.value as AmountUnit,
                  }))
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
        </Grid>

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
        {form.rating === 0 && isValid && (
          <Typography variant="caption" color="error">
            Please select a rating.
          </Typography>
        )}

        <TextField
          label="Reaction"
          placeholder="Notes or reactions"
          value={form.reaction}
          onChange={(e) => setForm((f) => ({ ...f, reaction: e.target.value }))}
          fullWidth
        />
      </Box>
    </DialogContent>

    <DialogActions>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="contained" onClick={handleSave} disabled={!isValid}>
        {mode === "create" ? "Save" : "Update"}
      </Button>
    </DialogActions>
  </Dialog>
);
