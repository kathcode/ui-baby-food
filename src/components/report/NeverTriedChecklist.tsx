import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AddIcon from "@mui/icons-material/Add";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import type { FoodType } from "../../types";
import type { Catalog } from "../../data/foodCatalog";
import { buildTriedKey } from "../../utils/foods";

type Props = {
  catalog: Catalog;
  triedKeys: Set<string>;
  onAddToCatalog: (type: FoodType, name: string) => void;
};

const TYPES: FoodType[] = ["Fruit", "Carbohydrates", "Protein", "Vegetables"];

export function NeverTriedChecklist({
  catalog,
  triedKeys,
  onAddToCatalog,
}: Props) {
  const neverTried = useMemo(() => {
    const result: Record<FoodType, string[]> = {
      Fruit: [],
      Carbohydrates: [],
      Protein: [],
      Vegetables: [],
    };
    TYPES.forEach((type) => {
      result[type] = (catalog[type] || []).filter((name) => {
        const key = buildTriedKey(name, type);
        return !triedKeys.has(key);
      });
    });
    return result;
  }, [catalog, triedKeys]);

  // add custom
  const [newType, setNewType] = useState<FoodType>("Fruit");
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    const clean = newName.trim();
    if (!clean) return;
    onAddToCatalog(newType, clean);
    setNewName("");
  };

  const exportCsv = () => {
    const rows = [["Type", "Name"]];
    TYPES.forEach((t) => neverTried[t].forEach((n) => rows.push([t, n])));
    const csv = rows
      .map((r) =>
        r
          .map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v))
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "never_tried_foods.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      {/* Add custom item */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          alignItems: "center",
          p: 2,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="subtitle1" sx={{ mr: 1 }}>
          Add to catalog
        </Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="add-type">Type</InputLabel>
          <Select
            labelId="add-type"
            label="Type"
            value={newType}
            onChange={(e) => setNewType(e.target.value as FoodType)}
          >
            {TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          label="Food name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? handleAdd() : null)}
        />
        <Button startIcon={<AddIcon />} variant="contained" onClick={handleAdd}>
          Add
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          startIcon={<SaveAltIcon />}
          variant="outlined"
          onClick={exportCsv}
        >
          Export CSV
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {TYPES.map((type) => {
        const items = catalog[type] || [];
        const pending = neverTried[type];
        const tried = items.length - pending.length;

        return (
          <Accordion key={type} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {type} &nbsp;
                <Chip
                  size="small"
                  label={`${pending.length} never tried`}
                  color={pending.length ? "warning" : "success"}
                  sx={{ mr: 1 }}
                />
                <Chip size="small" label={`${tried}/${items.length} tried`} />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {/* Never tried list */}
                <Grid component="div" size={{ xs: 12, md: 6 }}>
                  <Typography variant="overline">Never tried</Typography>
                  {pending.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      All tried 🎉
                    </Typography>
                  ) : (
                    <List dense>
                      {pending.map((name) => (
                        <ListItem key={name}>
                          <ListItemIcon>
                            <RadioButtonUncheckedIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText primary={name} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Grid>

                {/* Already tried list (for context) */}
                <Grid component="div" size={{ xs: 12, md: 6 }}>
                  <Typography variant="overline">Already tried</Typography>
                  {tried === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      None yet
                    </Typography>
                  ) : (
                    <List dense>
                      {items
                        .filter((n) => !pending.includes(n))
                        .map((name) => (
                          <ListItem key={name}>
                            <ListItemIcon>
                              <CheckCircleOutlineIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary={name} />
                          </ListItem>
                        ))}
                    </List>
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
