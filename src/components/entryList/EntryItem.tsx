import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import type { FoodEntry } from "../../types";
import { FoodChip } from "../ui/FoodChip";
import { ReadOnlyRating } from "../ui/ReadOnlyRating";

export function EntryItem({
  e,
  index,
  onEdit,
  onDelete,
}: {
  e: FoodEntry;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        bgcolor: index % 2 === 0 ? "background.default" : "grey.50",
        "&:hover": { bgcolor: "action.hover" },
        transition: "background-color 0.2s ease",
        borderRadius: 1,
        boxShadow:
          "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
        p: "16px",
        mb: "16px",
      }}
      secondaryAction={
        <>
          <IconButton
            edge="end"
            sx={{
              color: "primary.main",
              opacity: 0.85,
              "&:hover": { opacity: 1 },
            }}
            aria-label="edit"
            onClick={onEdit}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={onDelete}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </>
      }
    >
      <ListItemText
        primary={
          <Typography variant="subtitle1" fontWeight="bold">
            {e.typeOfMeal}
            {e.items.length > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                component="span"
              >
                — {format(e.date, "PP")}
              </Typography>
            )}
          </Typography>
        }
        secondary={
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
            {/* Chips row */}
            {e.items?.length > 0 && (
              <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                {e.items.map((it, i) => (
                  <FoodChip key={i} item={it} />
                ))}
              </Stack>
            )}

            <Stack
              direction="row"
              spacing={2}
              useFlexGap
              flexWrap="wrap"
              alignItems="center"
            >
              {typeof e.amount === "number" && (
                <Typography variant="body2" color="text.secondary">
                  Amount: {e.amount}
                  {e.amountUnit ? ` ${e.amountUnit}` : ""}
                </Typography>
              )}
              {e.reaction && (
                <Typography variant="body2" color="text.secondary">
                  Reaction: {e.reaction}
                </Typography>
              )}
              {typeof e.rating === "number" && e.rating > 0 && (
                <ReadOnlyRating value={e.rating} />
              )}
            </Stack>
          </Box>
        }
      />
    </ListItem>
  );
}
