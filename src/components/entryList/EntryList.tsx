import { Box, Button, List, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { isSameDay } from "date-fns";
import type { FoodEntry, SortKey } from "../../types";
import { EmptyList } from "../emptyList";
import { useMemo } from "react";
import { EntryItem } from "../entryList/EntryItem";
import { sortFood } from "../../utils/foods";

export function EntryList({
  entries,
  sortBy = "newest",
  onEdit,
  onDelete,
  onCreate,
}: {
  entries: FoodEntry[];
  sortBy: SortKey;
  onEdit: (e: FoodEntry) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}) {
  const sorted = useMemo(() => {
    const arr = [...entries];
    const sortedFood = sortFood(arr, sortBy);
    return sortedFood;
  }, [entries, sortBy]);

  const today = new Date();
  const todaysEntries = sorted.filter((e) => isSameDay(e.date, today));
  const otherEntries = sorted.filter((e) => !isSameDay(e.date, today));

  return (
    <Box sx={{ py: 3 }}>
      {/* Today */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5">Today's Foods</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreate}
          >
            New Log
          </Button>
        </Box>
      </Box>

      {todaysEntries.length === 0 ? (
        <EmptyList title={"Today"}>
          <Typography variant="body2" color="text.secondary">
            No entires for today.
          </Typography>
        </EmptyList>
      ) : (
        <List>
          {todaysEntries.map((e, index) => (
            <EntryItem
              e={e}
              index={index}
              onEdit={() => onEdit(e)}
              onDelete={() => onDelete(e.id)}
            />
          ))}
        </List>
      )}

      {/* Previous days */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Previous days
      </Typography>
      {otherEntries.length === 0 ? (
        <EmptyList title={"Previous days"}>
          <Typography variant="body2" color="text.secondary">
            No entires for previous days.
          </Typography>
        </EmptyList>
      ) : (
        <List>
          {otherEntries.map((e, index) => (
            <EntryItem
              e={e}
              index={index}
              onEdit={() => onEdit(e)}
              onDelete={() => onDelete(e.id)}
            />
          ))}
        </List>
      )}
    </Box>
  );
}
