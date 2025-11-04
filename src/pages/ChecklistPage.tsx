import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useEntriesApi } from "../api/entries";
import { loadCatalog, saveCustomItem } from "../data/foodCatalog";
import { triedKeySet } from "../utils/foods";
import { NeverTriedChecklist } from "../components/report/NeverTriedChecklist";
import { fromServerEntry } from "../api/types";
import type { FoodEntry } from "../types";

export default function ChecklistPage() {
  const [catalog, setCatalog] = useState(loadCatalog());
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const triedKeys = useMemo(() => triedKeySet(entries), [entries]);
  const entriesApi = useEntriesApi();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Pull a generous page (adjust if you expect >2000 entries)
        const res = await entriesApi.list({
          limit: 50,
          offset: 0,
          sort: "newest",
        });
        if (alive) {
          const mappedEntries = res.items.map(fromServerEntry);
          setEntries(mappedEntries);
        }
      } catch (e: unknown) {
        console.log(e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Never Tried Checklist
      </Typography>
      <NeverTriedChecklist
        catalog={catalog}
        triedKeys={triedKeys}
        onAddToCatalog={(type, name) => {
          saveCustomItem(type, name);
          setCatalog(loadCatalog()); // refresh merged catalog
        }}
      />
    </Box>
  );
}
