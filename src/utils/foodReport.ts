// src/utils/foodReport.ts
import { format } from "date-fns";
import type { FoodEntry, FoodType } from "../types";
import { normalizeFoodName } from "./foods";

export type FoodReportRow = {
  key: string; // normalized key (name|type)
  name: string;
  type: FoodType;
  count: number; // how many times appeared
  firstDate: Date;
  lastDate: Date;
  avgRating: number; // based on entries that included this item
};

export function buildFoodReport(entries: FoodEntry[]): FoodReportRow[] {
  const map = new Map<
    string,
    FoodReportRow & { ratingSum: number; ratingCount: number }
  >();

  for (const e of entries) {
    const uniqueKeysInEntry = new Set<string>(); // avoid double-counting if same food repeated in one entry
    for (const it of e.items) {
      const key = `${normalizeFoodName(it.name)}|${it.type}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: it.name.trim(),
          type: it.type,
          count: 0,
          firstDate: e.date,
          lastDate: e.date,
          avgRating: 0,
          ratingSum: 0,
          ratingCount: 0,
        });
      }
      const row = map.get(key)!;

      // count once per entry per food
      if (!uniqueKeysInEntry.has(key)) {
        row.count += 1;
        uniqueKeysInEntry.add(key);
      }
      if (e.date < row.firstDate) row.firstDate = e.date;
      if (e.date > row.lastDate) row.lastDate = e.date;

      if (typeof e.rating === "number" && e.rating > 0) {
        row.ratingSum += e.rating;
        row.ratingCount += 1;
      }
    }
  }

  return Array.from(map.values()).map((r) => ({
    ...r,
    avgRating: r.ratingCount ? +(r.ratingSum / r.ratingCount).toFixed(2) : 0,
  }));
}

export function toCsv(rows: FoodReportRow[]) {
  const header = [
    "Name",
    "Type",
    "Times eaten",
    "First seen",
    "Last seen",
    "Avg rating",
  ];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [
        csv(r.name),
        csv(r.type),
        r.count,
        csv(format(r.firstDate, "yyyy-MM-dd")),
        csv(format(r.lastDate, "yyyy-MM-dd")),
        r.avgRating,
      ].join(",")
    ),
  ];
  return lines.join("\n");
}

function csv(v: string) {
  // naive CSV escape
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
