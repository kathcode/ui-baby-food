import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  Alert,
} from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { useNavigate } from "react-router-dom";
import {
  startOfDay,
  endOfDay,
  subDays,
  isSameDay,
  format,
  startOfWeek,
} from "date-fns";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import TodayIcon from "@mui/icons-material/Today";

import { entriesApi } from "../api/entries";
import { recipesApi } from "../api/recipes";
import type { SRecipe } from "../api/recipes";
import { fromServerEntry } from "../api/types";
import type { FoodEntry } from "../types";

import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { KpiCard } from "../components/ui/KpiCard";
import { annotateNewFoods, normalizeFoodName } from "../utils/foods";

const FOOD_TYPES = ["Fruit", "Carbohydrates", "Protein", "Vegetables"] as const;

// Narrowing helper for optional flag added by annotateNewFoods
function hasNewFlag(it: unknown): it is { __isNew?: boolean } {
  return typeof it === "object" && it !== null && "__isNew" in it;
}

export default function OverviewPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [entriesToday, setEntriesToday] = useState<FoodEntry[]>([]);
  const [entries7d, setEntries7d] = useState<FoodEntry[]>([]);
  const [recipes, setRecipes] = useState<SRecipe[]>([]);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setErr(null);

        const today = new Date();
        const fromToday = startOfDay(today).toISOString();
        const toToday = endOfDay(today).toISOString();

        const from7d = startOfDay(subDays(today, 6)).toISOString();
        const to7d = endOfDay(today).toISOString();

        const [entriesTodayRes, entries7dRes, recipesRes] = await Promise.all([
          entriesApi.list({ dateFrom: fromToday, dateTo: toToday }),
          entriesApi.list({ dateFrom: from7d, dateTo: to7d, limit: 50 }), // plenty
          recipesApi.list(),
        ]);

        if (!alive) return;

        const mappedToday = entriesTodayRes.items.map(fromServerEntry);
        const mapped7d = entries7dRes.items.map(fromServerEntry);

        // mark newness for this week
        const weeklyCutoff = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
        const entries7dWithFlags = annotateNewFoods(mapped7d, weeklyCutoff);
        setEntries7d(entries7dWithFlags);

        setEntriesToday(
          mappedToday.filter((e) => isSameDay(e.date, new Date()))
        );

        setRecipes(recipesRes.items);
      } catch (e: unknown) {
        if (!alive) return;
        setErr(e instanceof Error ? e.message : "Failed to load overview");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const newFoodsThisWeekCount = useMemo(() => {
    const s = new Set<string>();
    entries7d.forEach((e) => {
      e.items.forEach((it) => {
        if (hasNewFlag(it) && it.__isNew) s.add(normalizeFoodName(it.name));
      });
    });
    return s.size;
  }, [entries7d]);

  // --- KPIs ---
  const mealsTodayCount = entriesToday.length;
  const recipesCount = recipes.length;

  // --- Build last-7-days axis labels ---
  const last7Dates = useMemo(() => {
    const arr: Date[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) arr.push(subDays(today, i));
    return arr;
  }, []);

  // --- Bar data: meals per day ---
  const mealsPerDay = useMemo(() => {
    return last7Dates.map(
      (d) => entries7d.filter((e) => isSameDay(e.date, d)).length
    );
  }, [entries7d, last7Dates]);

  const barLabels = last7Dates.map((d) => format(d, "EEE")); // Mon, Tue, ...

  // --- Pie data: food type distribution across all items in last 7 days ---
  const typeTotals = useMemo(() => {
    const counts: Record<string, number> = {
      Fruit: 0,
      Carbohydrates: 0,
      Protein: 0,
      Vegetables: 0,
    };
    entries7d.forEach((e) => {
      e.items.forEach((it) => {
        if (counts[it.type] !== undefined) counts[it.type] += 1;
      });
    });
    return counts;
  }, [entries7d]);

  const pieData = FOOD_TYPES.map((t, i) => ({
    id: i,
    label: t,
    value: typeTotals[t] || 0,
  }));

  const hasPieValues = pieData.some((p) => p.value > 0);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Overview
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : err ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      ) : (
        <>
          {/* Dashboard KPIs */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <KpiCard
                title="Meals today"
                value={mealsTodayCount}
                subtitle="Logged entries for the current day"
                icon={<RestaurantIcon />}
                color="primary"
                loading={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <KpiCard
                title="Recipes saved"
                value={recipesCount}
                subtitle="Total recipes in your cookbook"
                icon={<BookmarksIcon />}
                color="success"
                loading={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <KpiCard
                title="Today’s foods"
                value={
                  entriesToday.length === 0
                    ? "—"
                    : `${entriesToday.flatMap((e) => e.items).length}`
                }
                subtitle={
                  entriesToday.length === 0
                    ? "No foods logged yet"
                    : `${
                        entriesToday.flatMap((e) => e.items).length
                      } items recorded`
                }
                icon={<TodayIcon />}
                color="warning"
                loading={loading}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <KpiCard
                title="New foods this week"
                value={newFoodsThisWeekCount || "—"}
                subtitle="Distinct first-time items"
                icon={<StarOutlineIcon />}
                color="info"
                loading={loading}
              />
            </Grid>
          </Grid>

          {/* Action Cards */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <Card sx={{ borderRadius: 1, boxShadow: 2, mt: 2 }}>
                <CardActionArea onClick={() => navigate("/recipes")}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700}>
                      + Add Recipe
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      Create your saved baby-friendly recipes.
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      You have {recipesCount} recipes
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <Card sx={{ borderRadius: 1, boxShadow: 2, mt: 2 }}>
                <CardActionArea onClick={() => navigate("/log")}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700}>
                      + Add Food Log
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      Log today’s meals with ratings and reactions.
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      {mealsTodayCount} meals logged today
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={2}>
            {/* Meals per day (bar) */}
            <Grid size={{ xs: 12, md: 6, lg: 6 }} sx={{ mt: 2 }}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Meals per day (last 7 days)
                </Typography>
                <BarChart
                  xAxis={[{ scaleType: "band", data: barLabels }]}
                  series={[{ data: mealsPerDay }]}
                  height={280}
                  margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
                />
              </Card>
            </Grid>

            {/* Food type distribution (pie) */}
            <Grid size={{ xs: 12, md: 6, lg: 6 }} sx={{ mt: 2 }}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Food types (last 7 days)
                </Typography>
                {hasPieValues ? (
                  <PieChart
                    series={[
                      { data: pieData, innerRadius: 30, paddingAngle: 4 },
                    ]}
                    height={280}
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No food items recorded in the last 7 days
                  </Typography>
                )}
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
