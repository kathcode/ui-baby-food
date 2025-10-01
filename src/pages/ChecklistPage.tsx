import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { entriesApi } from "../api/entries";
import { loadCatalog, saveCustomItem } from "../data/foodCatalog";
import { triedKeySet } from "../utils/foods";
import { NeverTriedChecklist } from "../components/report/NeverTriedChecklist";

export default function ChecklistPage() {
  const [catalog, setCatalog] = useState(loadCatalog());
  const [entries, setEntries] = useState([]);
  const triedKeys = useMemo(() => triedKeySet(entries), [entries]);

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
        setEntries(res.items);
      } catch (e: any) {
        console.log(e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
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
