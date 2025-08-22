import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Tooltip,
  Button,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import type { Recipe } from "../types";
import { loadRecipes, saveRecipes } from "../utils/storage";
import RecipeEditorDialog from "../components/RecipeEditorDialog";
import { useNavigate } from "react-router-dom";
import { EmptyList } from "../components/emptyList";
import { FoodChip } from "../components/ui/FoodChip";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>(() => loadRecipes());
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    severity: "success" | "error";
  }>({
    open: false,
    msg: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    saveRecipes(recipes);
  }, [recipes]);

  const remove = (id: string) =>
    setRecipes((rs) => rs.filter((r) => r.id !== id));

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };
  const openEdit = (recipe: Recipe) => {
    setEditing(recipe);
    setEditorOpen(true);
  };
  const closeEditor = () => setEditorOpen(false);

  const handleSaveRecipe = (payload: {
    id?: string;
    name: string;
    description?: string;
    items: Recipe["items"];
  }) => {
    if (payload.id) {
      // update existing
      setRecipes((rs) =>
        rs.map((r) =>
          r.id === payload.id ? ({ ...r, ...payload } as Recipe) : r
        )
      );
      setSnack({ open: true, msg: "Recipe updated", severity: "success" });
    } else {
      // create new
      const newRecipe: Recipe = { id: crypto.randomUUID(), ...payload };
      setRecipes((rs) => [newRecipe, ...rs]);
      setSnack({ open: true, msg: "Recipe saved", severity: "success" });
    }
    setEditorOpen(false);
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5">Saved Recipes</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            New Recipe
          </Button>
        </Box>
      </Box>

      {recipes.length === 0 ? (
        <EmptyList title={"No recipes yet"}>
          <Typography variant="body2" color="text.secondary">
            Create a recipe with <strong>New Recipe</strong> or create an entry
            and click <strong>Save as Recipe</strong>.
          </Typography>
        </EmptyList>
      ) : (
        <List sx={{ width: "100%" }}>
          {recipes.map((r, idx) => (
            <Card key={r.id} sx={{ mb: 2 }}>
              <ListItem
                sx={{
                  bgcolor: idx % 2 === 0 ? "background.default" : "grey.50",
                  "&:hover": { bgcolor: "action.hover" },
                  transition: "background-color 0.2s ease",
                  borderRadius: 2,
                  boxShadow: "none",
                  p: "16px",
                }}
                secondaryAction={
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      onClick={() =>
                        navigate("/", {
                          state: { openNewEntry: true, recipeId: r.id },
                        })
                      }
                    >
                      Use Recipe
                    </Button>
                    <Tooltip title="Edit recipe">
                      <IconButton
                        edge="end"
                        sx={{
                          color: "primary.main",
                          opacity: 0.85,
                          "&:hover": { opacity: 1 },
                        }}
                        onClick={() => openEdit(r)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete recipe">
                      <IconButton
                        edge="end"
                        onClick={() => remove(r.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={600}>
                      {r.name || "Untitled recipe"}
                    </Typography>
                  }
                  secondary={
                    <>
                      {r.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.75 }}
                        >
                          {r.description}
                        </Typography>
                      )}

                      <Stack
                        direction="row"
                        spacing={0.75}
                        useFlexGap
                        flexWrap="wrap"
                      >
                        {r.items.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            No ingredients
                          </Typography>
                        ) : (
                          r.items.map((it, i) => <FoodChip key={i} item={it} />)
                        )}
                      </Stack>
                    </>
                  }
                />
              </ListItem>
            </Card>
          ))}
        </List>
      )}

      <RecipeEditorDialog
        open={editorOpen}
        initial={editing ?? undefined}
        onClose={closeEditor}
        onSave={handleSaveRecipe}
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={2200}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
