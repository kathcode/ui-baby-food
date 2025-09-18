import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from "@mui/material";
import { FoodChip } from "./ui/FoodChip";
import { recipesApi, type SRecipe } from "../api/recipes";

type Props = {
  open: boolean;
  recipeId: string | null;
  onClose: () => void;
  onUseRecipe?: (recipeId: string) => void; // optional
};

export default function RecipeDetailsDialog({
  open,
  recipeId,
  onClose,
  onUseRecipe,
}: Props) {
  const [data, setData] = useState<SRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !recipeId) return;
    let alive = true;
    setLoading(true);
    setErr(null);
    recipesApi
      .get(recipeId)
      .then((r) => {
        if (alive) setData(r);
      })
      .catch((e) => {
        if (alive) setErr(e.message || "Failed to load recipe");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [open, recipeId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {data?.name || (loading ? "Loading..." : "Recipe details")}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {err && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {err}
          </Alert>
        )}

        {!loading && !err && data && (
          <>
            {data.description && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {data.description}
              </Typography>
            )}

            {data.items?.length > 0 && (
              <Stack
                direction="row"
                spacing={0.75}
                useFlexGap
                flexWrap="wrap"
                sx={{ mb: 2 }}
              >
                {data.items.map((it, idx) => (
                  <FoodChip key={idx} item={it as any} />
                ))}
              </Stack>
            )}

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="subtitle2" gutterBottom>
              Ingredients
            </Typography>
            <Table size="small" aria-label="ingredients">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Unit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((it, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{it.name}</TableCell>
                    <TableCell>{it.type}</TableCell>
                    <TableCell align="right">
                      {typeof it.amount === "number" ? it.amount : "—"}
                    </TableCell>
                    <TableCell>{it.amountUnit ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          Close
        </Button>
        {onUseRecipe && recipeId && (
          <Button
            onClick={() => onUseRecipe(recipeId)}
            color="primary"
            variant="contained"
          >
            Use Recipe
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
