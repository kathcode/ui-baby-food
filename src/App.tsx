import { useEffect, useState } from "react";
import {
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  Fab,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import { HeaderBar } from "./components/HeaderBar";
import { EntryFormDialog } from "./components/entryFormDialog/EntryFormDialog";
import { EntryList } from "./components/entryList/EntryList"; // your existing list component
import RecipesPage from "./pages/RecipesPage";
import { startOfWeek } from "date-fns";

import {
  emptyForm,
  type AmountUnit,
  type FoodEntry,
  type FoodItem,
  type FormState,
  type MealType,
  type Mode,
  type Recipe,
} from "./types";
import {
  loadEntries,
  saveEntries,
  loadRecipes,
  saveRecipes,
} from "./utils/storage";
import { RecipeNameDialog } from "./components/RecipeNameDialog";
import { entriesApi } from "./api/entries";
import { fromServerEntry, toServerEntry } from "./api/types";
import HomePage from "./pages/HomePage";
import { annotateNewFoods } from "./utils/foods";
import ReportPage from "./pages/ReportPage";
import ChecklistPage from "./pages/ChecklistPage";

export default function App() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [entries, setEntries] = useState<FoodEntry[]>(() => loadEntries());
  const [recipes, setRecipes] = useState<Recipe[]>(() => loadRecipes());
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false);
  const [recipeDefaultName, setRecipeDefaultName] = useState("");
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    severity: "success" | "error";
  }>({ open: false, msg: "", severity: "success" });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);
  useEffect(() => {
    saveRecipes(recipes);
  }, [recipes]);

  // ===== FETCH entries on mount (and when sort changes, if you want server sort) =====
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await entriesApi.list({ sort: "newest" });
        const mapped = res.items.map(fromServerEntry);

        const cutoff = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
        const withFlags = annotateNewFoods(mapped, cutoff);

        if (alive) setEntries(withFlags);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Open modal from navigation state and optionally prefill with recipe
  useEffect(() => {
    const state = location.state as {
      openNewEntry?: boolean;
      recipeId?: string;
    };
    if (state?.openNewEntry) {
      if (state.recipeId) {
        const recipes = loadRecipes(); // from utils/storage
        const recipe = recipes.find((r) => r.id === state.recipeId);
        if (recipe) {
          setForm((f) => ({ ...f, items: recipe.items }));
        }
      } else {
        setForm({ ...emptyForm });
      }
      setMode("create");
      setEditingId(null);
      setOpen(true);
      // clear state
      navigate(".", { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // ===== entries CRUD =====
  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm({ ...emptyForm });
    setOpen(true);
  };

  const openEdit = (entry: FoodEntry) => {
    setMode("edit");
    setEditingId(entry.id);
    setForm({
      date: entry.date ?? null,
      items: entry.items?.length ? entry.items : [{ name: "", type: "Fruit" }],
      typeOfMeal: entry.typeOfMeal,
      amount: typeof entry.amount === "number" ? entry.amount : "",
      amountUnit: entry.amountUnit ?? "",
      reaction: entry.reaction ?? "",
      rating: entry.rating ?? 0,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.date) return;
    const cleanedItems = form.items.map<FoodItem>((it) => ({
      name: it.name.trim(),
      type: it.type,
      amount: typeof it.amount === "number" ? it.amount : undefined,
      amountUnit: it.amountUnit,
    }));

    if (mode === "create") {
      const newEntry: FoodEntry = {
        id: crypto.randomUUID(),
        date: form.date,
        items: cleanedItems,
        typeOfMeal: form.typeOfMeal as MealType,
        amount: form.amount === "" ? undefined : Number(form.amount),
        amountUnit: (form.amount === ""
          ? undefined
          : form.amountUnit || "ml") as AmountUnit | undefined,
        reaction: form.reaction || undefined,
        rating: form.rating || 0,
      };
      const saved = await entriesApi.create(toServerEntry(newEntry));
      const fe = fromServerEntry(saved);
      setEntries((prev) => [fe, ...prev]);
      setOpen(false);
    } else if (mode === "edit" && editingId) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? {
                ...e,
                date: form.date!,
                items: cleanedItems,
                typeOfMeal: form.typeOfMeal as MealType,
                amount: form.amount === "" ? undefined : Number(form.amount),
                amountUnit: (form.amount === ""
                  ? undefined
                  : form.amountUnit || "ml") as AmountUnit | undefined,
                reaction: form.reaction || undefined,
                rating: form.rating || 0,
              }
            : e
        )
      );
    }
    if (!editingId) return;
    const saved = await entriesApi.update(
      editingId,
      toServerEntry(form as FoodEntry)
    );
    const fe = fromServerEntry(saved);
    setEntries((prev) => prev.map((e) => (e.id === editingId ? fe : e)));
    setForm({ ...emptyForm });
    setEditingId(null);
    setOpen(false);
  };

  // Delete flow (if you have it in list component, keep that there)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await entriesApi.remove(pendingDeleteId);
      setEntries((prev) => prev.filter((e) => e.id !== pendingDeleteId));
    } catch (err) {
      console.error(err);
    }
    setPendingDeleteId(null);
    setConfirmOpen(false);
  };
  const cancelDelete = () => {
    setPendingDeleteId(null);
    setConfirmOpen(false);
  };

  const handleSaveRecipeClicked = () => {
    // build a friendly default name from current rows if available
    const names = form.items.map((it) => it.name).filter(Boolean);
    setRecipeDefaultName(names.length ? names.join(", ") : "");
    setRecipeDialogOpen(true);
  };

  const confirmSaveRecipe = async (name: string) => {
    const items = form.items
      .map((it) => ({ name: it.name.trim(), type: it.type }))
      .filter((it) => it.name); // only non-empty

    if (items.length === 0) {
      setSnack({
        open: true,
        msg: "Add at least one food to save a recipe.",
        severity: "error",
      });
      setRecipeDialogOpen(false);
      return;
    }

    const newRecipe: Recipe = { id: crypto.randomUUID(), name, items };
    setRecipes((prev) => [newRecipe, ...prev]);
    //const saved = await entriesApi.create(toServerEntryFromForm(newEntry));
    setRecipeDialogOpen(false);
    setSnack({
      open: true,
      msg: `Recipe “${name}” saved.`,
      severity: "success",
    });
  };

  return (
    <>
      <HeaderBar />

      <Routes>
        <Route
          path="/"
          element={
            <Container sx={{ py: 3 }}>
              <HomePage />
            </Container>
          }
        />

        <Route
          path="/log"
          element={
            <Container sx={{ py: 3 }}>
              <EntryList
                entries={entries}
                sortBy={"newest"}
                onEdit={openEdit}
                onDelete={requestDelete}
                onCreate={openCreate}
              />

              <EntryFormDialog
                open={open}
                mode={mode}
                form={form}
                setForm={setForm}
                onClose={() => setOpen(false)}
                onSubmit={handleSave}
                onSaveRecipe={handleSaveRecipeClicked}
              />

              <Dialog open={confirmOpen} onClose={cancelDelete}>
                <DialogTitle>Delete this entry?</DialogTitle>
                <DialogActions>
                  <Button onClick={cancelDelete}>Cancel</Button>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={confirmDelete}
                  >
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>

              <RecipeNameDialog
                open={recipeDialogOpen}
                defaultName={recipeDefaultName}
                onCancel={() => setRecipeDialogOpen(false)}
                onConfirm={confirmSaveRecipe}
              />

              <Snackbar
                open={snack.open}
                autoHideDuration={2500}
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
            </Container>
          }
        />

        <Route
          path="/recipes"
          element={
            <Container sx={{ py: 3 }}>
              <RecipesPage />
            </Container>
          }
        />

        <Route
          path="/checklist"
          element={
            <Container sx={{ py: 3 }}>
              <ChecklistPage />
            </Container>
          }
        />

        <Route
          path="/report"
          element={
            <Container sx={{ py: 3 }}>
              <ReportPage />
            </Container>
          }
        />
      </Routes>
    </>
  );
}
