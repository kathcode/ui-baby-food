import { useEffect, useState } from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import RecipeEditorDialog from "../components/RecipeEditorDialog";
import RecipeDetailsDialog from "../components/RecipeDetailsDialog";
import { FoodChip } from "../components/ui/FoodChip";

// 🔗 API
import { recipesApi, type SRecipe, type SFoodItem } from "../api/recipes";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<SRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // editor state (if you still want create/edit here)
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<SRecipe | null>(null);

  // details state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  // Fetch list on mount
  useEffect(() => {
    let alive = true;
    setLoading(true);
    recipesApi
      .list()
      .then((res) => {
        if (alive) setRecipes(res.items);
      })
      .catch((e: unknown) => {
        if (alive)
          setErr(e instanceof Error ? e.message : "Failed to load recipes");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const remove = async (id: string) => {
    try {
      await recipesApi.remove(id);
      setRecipes((rs) => rs.filter((r) => r._id !== id));
      setSnack({ open: true, msg: "Recipe deleted", severity: "success" });
    } catch (e: unknown) {
      setSnack({
        open: true,
        msg: e instanceof Error ? e.message : "Delete failed",
        severity: "error",
      });
    }
  };

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };
  const openEdit = (recipe: SRecipe) => {
    setEditing(recipe);
    setEditorOpen(true);
  };
  const closeEditor = () => setEditorOpen(false);

  const handleSaveRecipe = async (payload: {
    id?: string;
    name: string;
    description?: string;
    items: SFoodItem[];
  }) => {
    try {
      if (payload.id) {
        const updated = await recipesApi.update(payload.id, {
          name: payload.name,
          description: payload.description,
          items: payload.items,
        });
        setRecipes((rs) =>
          rs.map((r) => (r._id === updated._id ? updated : r))
        );
        setSnack({ open: true, msg: "Recipe updated", severity: "success" });
      } else {
        const created = await recipesApi.create({
          name: payload.name,
          description: payload.description,
          items: payload.items,
        });
        setRecipes((rs) => [created, ...rs]);
        setSnack({ open: true, msg: "Recipe saved", severity: "success" });
      }
    } catch (e: unknown) {
      setSnack({
        open: true,
        msg: e instanceof Error ? e.message : "Save failed",
        severity: "error",
      });
    } finally {
      setEditorOpen(false);
    }
  };

  // details open/close
  const openDetails = (id: string) => {
    setSelectedId(id);
    setDetailsOpen(true);
  };
  const closeDetails = () => {
    setSelectedId(null);
    setDetailsOpen(false);
  };

  const handleUseRecipe = (id: string) => {
    closeDetails();
    navigate("/", { state: { openNewEntry: true, recipeId: id } });
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

      {loading && (
        <Typography color="text.secondary">Loading recipes…</Typography>
      )}
      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}

      {!loading &&
        !err &&
        (recipes.length === 0 ? (
          <Box
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              No recipes yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a recipe with <strong>New Recipe</strong> or create an
              entry and click <strong>Save as Recipe</strong>.
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: "100%" }}>
            {recipes.map((r, idx) => (
              <Card key={r._id} sx={{ mb: 2 }}>
                <ListItem
                  sx={{
                    bgcolor: idx % 2 === 0 ? "background.default" : "grey.50",
                    "&:hover": { bgcolor: "action.hover" },
                    transition: "background-color 0.2s ease",
                    borderRadius: 2,
                    boxShadow: 1,
                    p: "16px",
                  }}
                  secondaryAction={
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="View recipe">
                        <IconButton
                          edge="end"
                          onClick={() => openDetails(r._id)}
                          sx={{ color: "primary.main", opacity: 0.9 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Button
                        size="small"
                        onClick={() =>
                          navigate("/", {
                            state: { openNewEntry: true, recipeId: r._id },
                          })
                        }
                      >
                        Use Recipe
                      </Button>
                      <Tooltip title="Edit recipe">
                        <IconButton edge="end" onClick={() => openEdit(r)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete recipe">
                        <IconButton
                          edge="end"
                          onClick={() => remove(r._id)}
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
                            r.items.map((it, i) => (
                              <FoodChip key={i} item={it as SFoodItem} />
                            ))
                          )}
                        </Stack>
                      </>
                    }
                  />
                </ListItem>
              </Card>
            ))}
          </List>
        ))}

      {/* Editor (create/edit) */}
      <RecipeEditorDialog
        open={editorOpen}
        initial={
          editing
            ? {
                id: editing._id,
                name: editing.name,
                description: editing.description,
                items: editing.items as SFoodItem[],
              }
            : undefined
        }
        onClose={closeEditor}
        onSave={(p) => handleSaveRecipe({ id: editing?._id, ...p })}
      />

      {/* Details (lazy fetch by id) */}
      <RecipeDetailsDialog
        open={detailsOpen}
        recipeId={selectedId}
        onClose={closeDetails}
        onUseRecipe={handleUseRecipe}
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
