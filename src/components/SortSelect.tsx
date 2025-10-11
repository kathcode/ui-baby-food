import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SortKey } from "../types";

export function SortSelect({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  return (
    <FormControl
      size="small"
      sx={{ minWidth: 190, bgcolor: "background.paper", borderRadius: 1 }}
    >
      <InputLabel id="sort-label">Sort</InputLabel>
      <Select
        labelId="sort-label"
        label="Sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
      >
        <MenuItem value="newest">Newest first</MenuItem>
        <MenuItem value="oldest">Oldest first</MenuItem>
        <MenuItem value="rating_desc">Highest rating</MenuItem>
        <MenuItem value="rating_asc">Lowest rating</MenuItem>
      </Select>
    </FormControl>
  );
}
