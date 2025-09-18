import React, { useEffect, useMemo, useState } from "react";
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
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  FOOD_OPTIONS,
  UNIT_OPTIONS,
  type AmountUnit,
  type FoodItem,
  type FoodType,
  type Recipe,
} from "../types";

type Props = {
  open: boolean;
  initial?: Partial<Recipe>; // for editing (optional)
  onClose: () => void;
  onSave: (recipe: {
    id?: string;
    name: string;
    description?: string;
    items: FoodItem[];
  }) => void;
};

export default function RecipeEditorDialog({
  open,
  initial,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [items, setItems] = useState<FoodItem[]>(
    initial?.items?.length ? initial.items : [{ name: "", type: "Fruit" }]
  );

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setDescription(initial?.description ?? "");
    setItems(
      initial?.items?.length ? initial.items : [{ name: "", type: "Fruit" }]
    );
  }, [open, initial]);

  const canSave = useMemo(() => {
    const base = name.trim().length > 0 && items.length > 0;
    const rowsOk = items.every(
      (it) =>
        it.name.trim() &&
        it.type &&
        (typeof it.amount !== "number" || !!it.amountUnit) // if amount, need unit
    );
    return base && rowsOk;
  }, [name, items]);

  const updateItem = (idx: number, patch: Partial<FoodItem>) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    );

  const addRow = () =>
    setItems((prev) => [...prev, { name: "", type: "Fruit" }]);

  const removeRow = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = () => {
    if (!canSave) return;
    const cleaned = items
      .map((it) => ({
        name: it.name.trim(),
        type: it.type,
        amount: typeof it.amount === "number" ? it.amount : undefined,
        amountUnit: it.amountUnit,
      }))
      .filter((it) => it.name);
    onSave({
      id: initial?.id,
      name: name.trim(),
      description: description.trim() || undefined,
      items: cleaned,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initial?.id ? "Edit Recipe" : "New Recipe"}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "grid", gap: 2, mt: 0.5 }}>
          <TextField
            label="Recipe name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Typography variant="subtitle2">Ingredients *</Typography>
            <Button size="small" onClick={addRow}>
              Add ingredient
            </Button>
          </Box>

          {items.map((it, idx) => (
            <Grid container spacing={2} key={idx} alignItems="center">
              {/* Name */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Name"
                  value={it.name}
                  onChange={(e) => updateItem(idx, { name: e.target.value })}
                  fullWidth
                />
              </Grid>
              {/* Type */}
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel id={`type-${idx}`}>Type</InputLabel>
                  <Select
                    labelId={`type-${idx}`}
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
              {/* Amount */}
              <Grid item xs={12} sm={3}>
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
              {/* Unit */}
              <Grid item xs={12} sm={1.5}>
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
              {/* Remove */}
              <Grid
                item
                xs={12}
                sm={0.5}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {items.length > 1 && (
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
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!canSave}>
          {initial?.id ? "Update Recipe" : "Save Recipe"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
