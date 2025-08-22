import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

export function RecipeNameDialog({
  open,
  defaultName = "",
  onCancel,
  onConfirm,
}: {
  open: boolean;
  defaultName?: string;
  onCancel: () => void;
  onConfirm: (name: string) => void;
}) {
  const [name, setName] = useState(defaultName);
  useEffect(() => {
    setName(defaultName);
  }, [defaultName, open]);

  const canConfirm = name.trim().length > 0;

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>Save Recipe</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Recipe name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Banana & Yogurt Mix"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          disabled={!canConfirm}
          variant="contained"
          onClick={() => onConfirm(name.trim())}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
