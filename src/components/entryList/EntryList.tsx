import { Card, List, Typography } from "@mui/material";

import { isSameDay } from "date-fns";
import { EntryItem } from "./EntryItem";
import type { FoodEntry, SortKey } from "../../types";
import { EmptyList } from "../emptyList";
import { useMemo } from "react";

export function EntryList({
  entries,
  sortBy,
  onEdit,
  onDelete,
}: {
  entries: FoodEntry[];
  sortBy: SortKey;
  onEdit: (e: FoodEntry) => void;
  onDelete: (id: string) => void;
}) {
  const sorted = useMemo(() => {
    const arr = [...entries];
    switch (sortBy) {
      case "newest":
        arr.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case "oldest":
        arr.sort((a, b) => a.date.getTime() - b.date.getTime());
        break;
      case "rating_desc":
        arr.sort(
          (a, b) =>
            (b.rating ?? 0) - (a.rating ?? 0) ||
            b.date.getTime() - a.date.getTime()
        );
        break;
      case "rating_asc":
        arr.sort(
          (a, b) =>
            (a.rating ?? 0) - (b.rating ?? 0) ||
            b.date.getTime() - a.date.getTime()
        );
        break;
    }
    return arr;
  }, [entries, sortBy]);

  const today = new Date();
  const todaysEntries = sorted.filter((e) => isSameDay(e.date, today));
  const otherEntries = sorted.filter((e) => !isSameDay(e.date, today));

  return (
    <>
      {/* Today */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Today
      </Typography>

      {todaysEntries.length === 0 ? (
        <EmptyList title={"Today"}>
          <Typography variant="body2" color="text.secondary">
            No entires for today.
          </Typography>
        </EmptyList>
      ) : (
        <List>
          {todaysEntries.map((e, index) => (
            <Card key={e.id} sx={{ mb: 2 }}>
              <EntryItem
                e={e}
                index={index}
                onEdit={() => onEdit(e)}
                onDelete={() => onDelete(e.id)}
              />
            </Card>
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
            <Card key={e.id} sx={{ mb: 2 }}>
              <EntryItem
                e={e}
                index={index}
                onEdit={() => onEdit(e)}
                onDelete={() => onDelete(e.id)}
              />
            </Card>
          ))}
        </List>
      )}
    </>
  );
}
