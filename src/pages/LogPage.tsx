import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { EntryFormDialog } from "../components/entryFormDialog/EntryFormDialog";
import { EntryList } from "../components/entryList/EntryList";
import { RecipeNameDialog } from "../components/RecipeNameDialog";
import { useEffect, useState } from "react";
import {
  emptyForm,
  type AmountUnit,
  type FoodEntry,
  type FoodItem,
  type FormState,
  type MealType,
  type Mode,
  type Recipe,
} from "../types";
import {
  loadEntries,
  loadRecipes,
  saveEntries,
  saveRecipes,
} from "../utils/storage";
import { useLocation, useNavigate } from "react-router-dom";
import { useEntriesApi } from "../api/entries";
import { useRecipesApi } from "../api/recipes";
import { fromServerEntry, toServerEntry } from "../api/types";
import { startOfWeek } from "date-fns";
import { annotateNewFoods } from "../utils/foods";

export default function LogPage() {
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
  const entriesApi = useEntriesApi();
  const recipesApi = useRecipesApi();

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

  const getCleanedItems = form.items.map<FoodItem>((it) => ({
    name: it.name.trim(),
    type: it.type,
    amount: typeof it.amount === "number" ? it.amount : undefined,
    amountUnit: it.amountUnit,
  }));

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

  const parseFoodEntry = () => {
    const newEntry: FoodEntry = {
      id: crypto.randomUUID(),
      date: form.date || new Date(),
      items: getCleanedItems,
      typeOfMeal: form.typeOfMeal as MealType,
      amount: form.amount === "" ? undefined : Number(form.amount),
      amountUnit: (form.amount === "" ? undefined : form.amountUnit || "ml") as
        | AmountUnit
        | undefined,
      reaction: form.reaction || undefined,
      rating: form.rating || 0,
    };

    return newEntry;
  };

  const handleSave = async () => {
    if (!form.date) return;
    if (mode === "create") {
      const getNewEntryParsed = parseFoodEntry();
      const saved = await entriesApi.create(toServerEntry(getNewEntryParsed));
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
                items: getCleanedItems,
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
    const names = form.items.map((it) => it.name).filter(Boolean);
    setRecipeDefaultName(names.length ? names.join(", ") : "");
    setRecipeDialogOpen(true);
  };

  const confirmSaveRecipe = async (name: string, description: string) => {
    const items = form.items
      .map((it) => ({ ...it, name: it.name.trim(), type: it.type }))
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
    const saved = await recipesApi.create({
      name: name,
      description: description,
      items: items,
    });
    setRecipeDialogOpen(false);
    if (saved) {
      setSnack({
        open: true,
        msg: `Recipe “${name}” saved.`,
        severity: "success",
      });
    }
  };

  return (
    <>
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
          <Button color="error" variant="contained" onClick={confirmDelete}>
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
    </>
  );
}
