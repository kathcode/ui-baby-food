"use client";

import { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

type Mode = "subscription" | "payment";

const MONTHLY_FEATURES = [
  "Unlimited entries & kids",
  "Meal templates + favorites",
  "Caregiver sharing (1 invite)",
  "CSV export & growth snapshot",
  "Dark mode + priority support",
];

const LIFETIME_FEATURES = [
  "All Pro features forever",
  "No subscription",
  "Founders badge",
];

export default function PaywallCard() {
  const [loading, setLoading] = useState<string | null>(null);

  async function startCheckout(priceId: string, mode: Mode) {
    try {
      setLoading(priceId);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ priceId, mode }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const { url } = await res.json();
      window.location.href = url;
    } finally {
      setLoading(null);
    }
  }

  return (
    <Box maxWidth="lg" mx="auto">
      <Grid container spacing={3}>
        {/* Monthly plan */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardHeader
              title={
                <Typography variant="h6">Lil’ Munch Pro — Monthly</Typography>
              }
              subheader={
                <Typography variant="h4" fontWeight={700}>
                  $4.99{" "}
                  <Typography
                    component="span"
                    variant="subtitle2"
                    fontWeight={400}
                  >
                    CAD/mo
                  </Typography>
                </Typography>
              }
            />
            <CardContent>
              <List dense>
                {MONTHLY_FEATURES.map((t) => (
                  <ListItem key={t} disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={t} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={() =>
                  startCheckout(
                    process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY as string,
                    "subscription"
                  )
                }
                disabled={!!loading}
                endIcon={loading ? <CircularProgress size={18} /> : null}
              >
                {loading ? "Redirecting…" : "Start $4.99/mo"}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Lifetime plan */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardHeader
              title={<Typography variant="h6">Founding Lifetime</Typography>}
              subheader={
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    $29{" "}
                    <Typography
                      component="span"
                      variant="subtitle2"
                      fontWeight={400}
                    >
                      CAD
                    </Typography>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Limited founding offer
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              <List dense>
                {LIFETIME_FEATURES.map((t) => (
                  <ListItem key={t} disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={t} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button
                fullWidth
                size="large"
                variant="outlined"
                onClick={() =>
                  startCheckout(
                    process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_LIFETIME as string,
                    "payment"
                  )
                }
                disabled={!!loading}
                endIcon={loading ? <CircularProgress size={18} /> : null}
              >
                {loading ? "Redirecting…" : "Buy Lifetime $29"}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        textAlign="center"
        mt={2}
      >
        Prices in CAD. Taxes may apply. You’ll be redirected to our secure
        Stripe checkout.
      </Typography>
    </Box>
  );
}
