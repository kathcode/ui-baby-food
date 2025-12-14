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
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ShieldMoonRoundedIcon from "@mui/icons-material/ShieldMoonRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";

import { LineChart } from "./components/LineChart";
import { Metric } from "./components/Metric";
import theme from "../../theme";

// ---------- Mock data (swap with real later) ----------
const weeklyMeals = [4, 5, 5, 6, 5, 4, 6];
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
  name: "Luca",
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
              value={5}
              caption="07:30 – 18:30"
              color="primary"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Metric
              title="New foods"
              value={1}
              caption="Egg (1/3 exposures)"
              color="success"
              progress={33}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardHeader
                title={
                  <Typography variant="subtitle2">Weekly trend</Typography>
                }
                action={
                  <Chip
                    icon={<BarChartRoundedIcon />}
                    label="7 days"
                    size="small"
                  />
                }
                sx={{ pb: 0.5 }}
              />
              <CardContent sx={{ pt: 0.5 }}>
                <LineChart data={weeklyMeals} />
              </CardContent>
            </Card>
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
                          sx={{ mb: 0.5 }}
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

          {/* Caregiver activity */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardHeader title="Caregiver activity" subheader="Last 24h" />
              <CardContent>
                <Stack spacing={1.25}>
                  {[
                    { who: "Ana", action: "added Lunch log", time: "12:03" },
                    {
                      who: "Mark",
                      action: "viewed Weekly insights",
                      time: "09:20",
                    },
                    {
                      who: "Ana",
                      action: "joined as caregiver",
                      time: "08:02",
                    },
                  ].map((item, i) => (
                    <Stack
                      key={i}
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                    >
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {item.who[0]}
                      </Avatar>
                      <Typography sx={{ flex: 1 }}>
                        <b>{item.who}</b> {item.action}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.time}
                      </Typography>
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

          {/* Safety note */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              variant="outlined"
              sx={{ background: "linear-gradient(180deg, #FFFDF5, #FFFFFF)" }}
            >
              <CardHeader
                avatar={<WarningAmberRoundedIcon color="warning" />}
                title="Safety reminder"
                subheader="Textures first, then flavors."
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Offer mashable textures and avoid round/hard/slippery shapes.
                  Always supervise and consult your pediatrician for allergens
                  and portions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
