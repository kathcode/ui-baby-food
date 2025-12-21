import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  LinearProgress,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

// Icons
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import EggRoundedIcon from "@mui/icons-material/EggRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ShieldMoonRoundedIcon from "@mui/icons-material/ShieldMoonRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import { Metric } from "./components/Metric";
import theme from "../../theme";
import { useEffect, useMemo, useState } from "react";
import type { FoodEntry } from "../../types";
import {
  endOfDay,
  format,
  isSameDay,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { useEntriesApi } from "../../api/entries";
import { useRecipesApi, type SRecipe } from "../../api/recipes";
import { fromServerEntry } from "../../api/types";
import {
  annotateNewFoods,
  FOOD_TYPES,
  hasNewFlag,
  normalizeFoodName,
} from "../../utils/foods";
import { BarChart, PieChart } from "@mui/x-charts";

// ---------- Mock data (swap with real later) ----------
const recentLogs = [
  { time: "07:45", title: "Oat + Banana", amount: "120 ml", rating: 4 },
  { time: "11:50", title: "Lentil mash + carrot", amount: "80 g", rating: 5 },
  { time: "15:10", title: "Avocado mash", amount: "60 g", rating: 4 },
];
const exposures = [
  { name: "Egg", done: 1, total: 3, next: "Thu" },
  { name: "Peanut", done: 0, total: 3, next: "Sat" },
  { name: "Dairy", done: 0, total: 3, next: "Mon" },
];
const baby = {
  name: "Matthew",
  ageLabel: "9 mo",
  dob: "Mar 5",
  avatar: "L",
  tags: [
    {
      label: "Gentle textures",
      icon: <ShieldMoonRoundedIcon fontSize="small" />,
    },
    { label: "Favorites", icon: <FavoriteRoundedIcon fontSize="small" /> },
  ],
};

export default function DashboardPage() {
  const [entriesToday, setEntriesToday] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [entries7d, setEntries7d] = useState<FoodEntry[]>([]);
  const [recipes, setRecipes] = useState<SRecipe[]>([]);

  const entriesApi = useEntriesApi();
  const recipesApi = useRecipesApi();

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

  // --- Build last-7-days axis labels ---
  const last7Dates = useMemo(() => {
    const arr: Date[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) arr.push(subDays(today, i));
    return arr;
  }, []);

  // --- KPIs ---
  const mealsTodayCount = entriesToday.length;
  const recipesCount = recipes.length;
  const barLabels = last7Dates.map((d) => format(d, "EEE")); // Mon, Tue, ...

  // --- Bar data: meals per day ---
  const mealsPerDay = useMemo(() => {
    return last7Dates.map(
      (d) => entries7d.filter((e) => isSameDay(e.date, d)).length
    );
  }, [entries7d, last7Dates]);

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
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: "72px", md: "80px" },
          pb: 4,
        }}
      >
        <Grid container spacing={2.5}>
          {/* Baby header (NEW) */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                background:
                  theme.palette.mode === "light"
                    ? "linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 60%)"
                    : "linear-gradient(180deg, rgba(82,194,157,0.10) 0%, transparent 60%)",
              }}
            >
              {/* Soft top gradient bar */}
              <Box
                sx={{
                  height: 6,
                  background:
                    "linear-gradient(90deg, #5AA0E6 0%, #52C29D 100%)",
                }}
              />

              <CardContent
                sx={{ py: { xs: 2, sm: 2.5 }, px: { xs: 2, sm: 3 } }}
              >
                <Stack
                  direction={{ xs: "column", sm: "column" }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={2}
                >
                  <Box component="div">
                    <Avatar
                      src={
                        "https://robohash.org/f520cefe48e7afc5b62e0ec7d19f000e?set=set4&bgset=&size=400x400"
                      }
                      alt={baby.name}
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: "primary.main",
                        fontWeight: 800,
                        fontSize: 28,
                      }}
                    >
                      {baby.avatar}
                    </Avatar>
                  </Box>

                  <Box component="div">
                    <Stack alignItems="center" spacing={1} flexWrap="wrap">
                      <Typography
                        variant="h5"
                        fontWeight={800}
                        sx={{ mr: 0.5, lineHeight: 1.2 }}
                      >
                        {baby.name}
                      </Typography>
                    </Stack>

                    <Chip
                      size="small"
                      icon={<CakeRoundedIcon />}
                      label={baby.ageLabel}
                      sx={{ height: 24, mr: 1 }}
                    />

                    {baby.dob && (
                      <Chip
                        size="small"
                        variant="outlined"
                        icon={<CalendarMonthRoundedIcon />}
                        label={`DOB: ${baby.dob}`}
                        sx={{ height: 24 }}
                      />
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Top metrics */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Metric
              title="Meals today"
              value={mealsTodayCount}
              caption={
                mealsTodayCount === 0
                  ? "No foods logged yet"
                  : `${mealsTodayCount} items recorded`
              }
              color="primary"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Metric
              title="New foods"
              value={newFoodsThisWeekCount || "—"}
              caption="1/3 exposures in the week"
              color="primary"
              progress={33}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Metric
              title="Recipes saved"
              value={recipesCount || "—"}
              caption="Total recipes in your cookbook"
              color="primary"
            />
          </Grid>

          {/* Today's Overview & Quick Actions */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined">
              <CardHeader
                title="Today’s overview"
                subheader="Wed • Mealtime windows & notes"
                action={
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ShareRoundedIcon />}
                    >
                      Share
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<DownloadRoundedIcon />}
                    >
                      Export PDF
                    </Button>
                  </Stack>
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Metric
                      title="Breakfast"
                      value="07:45"
                      caption="Oat + Banana • 120 ml"
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Metric
                      title="Lunch"
                      value="12:00"
                      caption="Lentil mash + carrot"
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Metric
                      title="Snack"
                      value="15:10"
                      caption="Avocado mash"
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Metric
                      title="Dinner"
                      value="18:10"
                      caption="TBD • reminder set"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Allergen exposures */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardHeader
                title="Allergen exposures"
                subheader="Introduce safely & space them out"
                avatar={<EggRoundedIcon color="warning" />}
              />
              <CardContent>
                <Stack spacing={1.2}>
                  {exposures.map((e) => {
                    const pct = Math.round((e.done / e.total) * 100);
                    return (
                      <Box key={e.name}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography fontWeight={700}>{e.name}</Typography>
                          <Chip
                            size="small"
                            color={e.done > 0 ? "success" : "default"}
                            label={`${e.done}/${e.total} • next ${e.next}`}
                          />
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{
                            height: 8,
                            borderRadius: 8,
                            backgroundColor: "warning.light",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "warning.main",
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                  <Button
                    sx={{ mt: 1 }}
                    size="small"
                    startIcon={<NoteAddRoundedIcon />}
                  >
                    Log new exposure
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
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

          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Food types (last 7 days)
              </Typography>
              {hasPieValues ? (
                <PieChart
                  series={[{ data: pieData, innerRadius: 30, paddingAngle: 4 }]}
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

          {/* Recent logs */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardHeader title="Recent logs" subheader="Today" />
              <CardContent>
                <Stack spacing={1.25}>
                  {recentLogs.map((row, i) => (
                    <Stack
                      key={i}
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{
                        p: 1.25,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Chip label={row.time} size="small" />
                      <Typography sx={{ flex: 1 }}>
                        <Typography component="span" fontWeight={700}>
                          {row.title}
                        </Typography>{" "}
                        • {row.amount}
                      </Typography>
                      <Rating
                        value={row.rating}
                        readOnly
                        icon={<StarRoundedIcon fontSize="inherit" />}
                        emptyIcon={<StarRoundedIcon fontSize="inherit" />}
                        sx={{ color: "warning.main" }}
                      />
                      <Button variant="outlined" size="small">
                        Repeat
                      </Button>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Favorites + quick links */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardHeader title="Favorites" subheader="One-tap logging" />
              <CardContent>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {[
                    "Oat + Banana",
                    "Yogurt + Mango",
                    "Tofu + Peas",
                    "Salmon + Sweet potato",
                  ].map((f) => (
                    <Chip
                      key={f}
                      label={f}
                      icon={<CheckCircleRoundedIcon color="success" />}
                      onClick={() => {}}
                      sx={{ borderRadius: 2 }}
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
