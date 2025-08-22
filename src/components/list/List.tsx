import {
  Box,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { RatingComp } from "../rating/Rating";

export const ListComp = ({
  todaysEntries,
  openEdit,
  requestDelete,
  format,
}) => (
  <List>
    {todaysEntries.map((e, index) => (
      <Card key={e.id} sx={{ mb: 2 }}>
        <ListItem
          key={e.id}
          alignItems="flex-start"
          sx={{
            bgcolor: index % 2 === 0 ? "background.default" : "grey.50",
            "&:hover": { bgcolor: "action.hover" },
            transition: "background-color 0.2s ease",
            borderRadius: 2,
            boxShadow: 1,
            marginTop: 2,
            padding: "20px",
          }}
          secondaryAction={
            <>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => openEdit(e)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => requestDelete(e.id)}
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
                {e.items.length > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Foods:{" "}
                    {e.items.map((it) => `${it.name} (${it.type})`).join(", ")}
                  </Typography>
                )}
                {e.typeOfMeal} ({format(e.date, "PP")}
              </Typography>
            }
            secondary={
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mt: 0.5,
                }}
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
                  <RatingComp rating={e.rating} />
                )}
              </Box>
            }
          />
        </ListItem>
      </Card>
    ))}
  </List>
);
