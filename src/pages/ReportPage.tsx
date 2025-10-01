import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Alert,
} from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import type { FoodType } from "../types";
import { entriesApi } from "../api/entries";
import { fromServerEntry } from "../api/types";
import {
  buildFoodReport,
  toCsv,
  type FoodReportRow,
} from "../utils/foodReport";
import { loadCatalog } from "../data/foodCatalog";
import { triedKeySet } from "../utils/foods";

type Order = "asc" | "desc";
type SortKey =
  | "name"
  | "type"
  | "count"
  | "firstDate"
  | "lastDate"
  | "avgRating";

const FOOD_TYPES: (FoodType | "All")[] = [
  "All",
  "Fruit",
  "Carbohydrates",
  "Protein",
  "Vegetables",
];

export default function ReportPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [rows, setRows] = useState<FoodReportRow[]>([]);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<FoodType | "All">("All");
  const [orderBy, setOrderBy] = useState<SortKey>("lastDate");
  const [order, setOrder] = useState<Order>("desc");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        // Pull a generous page (adjust if you expect >2000 entries)
        const res = await entriesApi.list({
          limit: 50,
          offset: 0,
          sort: "newest",
        });
        const entries = res.items.map(fromServerEntry);
        const report = buildFoodReport(entries);
        if (alive) setRows(report);
      } catch (e: any) {
        if (alive) setErr(e.message || "Failed to load report");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQ = !query || r.name.toLowerCase().includes(query);
      const matchesType = typeFilter === "All" || r.type === typeFilter;
      return matchesQ && matchesType;
    });
  }, [rows, q, typeFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const dir = order === "asc" ? 1 : -1;
      switch (orderBy) {
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "type":
          return a.type.localeCompare(b.type) * dir;
        case "count":
          return (a.count - b.count) * dir;
        case "avgRating":
          return (a.avgRating - b.avgRating) * dir;
        case "firstDate":
          return (a.firstDate.getTime() - b.firstDate.getTime()) * dir;
        case "lastDate":
          return (a.lastDate.getTime() - b.lastDate.getTime()) * dir;
        default:
          return 0;
      }
    });
    return arr;
  }, [filtered, orderBy, order]);

  const onSort = (key: SortKey) => {
    if (orderBy === key) setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setOrderBy(key);
      setOrder(key === "name" || key === "type" ? "asc" : "desc");
    }
  };

  const exportCsv = () => {
    const csv = toCsv(sorted);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "baby_food_inventory.csv";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Food Inventory (All Ingredients Tried)
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Search food name"
              size="small"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="type-filter">Type</InputLabel>
              <Select
                labelId="type-filter"
                label="Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
              >
                {FOOD_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              startIcon={<SaveAltIcon />}
              variant="outlined"
              onClick={exportCsv}
            >
              Export CSV
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : err ? (
        <Alert severity="error">{err}</Alert>
      ) : (
        <Card>
          <Table size="small" aria-label="food inventory">
            <TableHead>
              <TableRow>
                <HeaderCell
                  label="Name"
                  sortKey="name"
                  orderBy={orderBy}
                  order={order}
                  onSort={onSort}
                />
                <HeaderCell
                  label="Type"
                  sortKey="type"
                  orderBy={orderBy}
                  order={order}
                  onSort={onSort}
                />
                <HeaderCell
                  label="Times eaten"
                  sortKey="count"
                  orderBy={orderBy}
                  order={order}
                  onSort={onSort}
                  align="right"
                />
                <HeaderCell
                  label="First seen"
                  sortKey="firstDate"
                  orderBy={orderBy}
                  order={order}
                  onSort={onSort}
                />
                <HeaderCell
                  label="Last seen"
                  sortKey="lastDate"
                  orderBy={orderBy}
                  order={order}
                  onSort={onSort}
                />
                <HeaderCell
                  label="Avg rating"
                  sortKey="avgRating"
                  orderBy={orderBy}
                  order={order}
                  onSort={onSort}
                  align="right"
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((r) => (
                <TableRow key={r.key} hover>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell align="right">{r.count}</TableCell>
                  <TableCell>{r.firstDate.toLocaleDateString()}</TableCell>
                  <TableCell>{r.lastDate.toLocaleDateString()}</TableCell>
                  <TableCell align="right">{r.avgRating || "—"}</TableCell>
                </TableRow>
              ))}
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body2" color="text.secondary">
                      No foods found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </Box>
  );
}

function HeaderCell(props: {
  label: string;
  sortKey: SortKey;
  orderBy: SortKey;
  order: Order;
  onSort: (k: SortKey) => void;
  align?: "left" | "right" | "center" | "inherit" | "justify";
}) {
  const { label, sortKey, orderBy, order, onSort, align } = props;
  const active = orderBy === sortKey;
  return (
    <TableCell align={align}>
      <TableSortLabel
        active={active}
        direction={active ? order : "asc"}
        onClick={() => onSort(sortKey)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
}
