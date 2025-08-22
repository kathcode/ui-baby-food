import React from "react";
import { Box, Rating } from "@mui/material";

export function ReadOnlyRating({
  value,
  size = "small",
}: {
  value: number;
  size?: "small" | "medium" | "large";
}) {
  return (
    <Box
      sx={{
        "& .MuiRating-iconFilled": { color: "#F9D976" }, // pastel yellow
        "& .MuiRating-iconHover": { color: "#F9D976" },
        "& .MuiRating-iconEmpty": { color: "rgba(0,0,0,0.18)" },
      }}
    >
      <Rating value={value} readOnly size={size} />
    </Box>
  );
}
