import React from "react";
import { Chip } from "@mui/material";
import type { FoodItem, FoodType } from "../../types";

const TYPE_STYLES: Record<FoodType, { bg: string; fg: string }> = {
  Fruit: { bg: "#FFEFF3", fg: "#A63A50" }, // soft pink
  Carbohydrates: { bg: "#FFF9E5", fg: "#7A5F00" }, // soft yellow
  Protein: { bg: "#E9F7FF", fg: "#0F5E86" }, // soft blue
  Vegetables: { bg: "#ECFFF3", fg: "#1A6B3D" }, // soft green
};

export function FoodChip({ item }: { item: FoodItem }) {
  const { bg, fg } = TYPE_STYLES[item.type];
  const qty =
    typeof item.amount === "number"
      ? ` — ${item.amount}${item.amountUnit ? ` ${item.amountUnit}` : ""}`
      : "";
  return (
    <Chip
      size="small"
      label={`${item.name} (${item.type})${qty}`}
      sx={{
        bgcolor: bg,
        color: fg,
        fontWeight: 600,
        borderRadius: 2,
        "& .MuiChip-label": { px: 1.25, py: 0.25 },
      }}
      variant="filled"
    />
  );
}
