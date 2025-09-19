import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PaywallCard from "../PaywallCard";

export default function ProTeaser() {
  const items = [
    "1-tap meal templates & favorites",
    "Share with a caregiver",
    "CSV export for your pediatrician",
  ];

  return (
    <Box component="section" py={{ xs: 6, md: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="h4" fontWeight={700}>
              Go Pro
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1.5}>
              Lil’ Munch makes baby meal logging fast, and turns your data into
              simple insights.
            </Typography>

            <List dense sx={{ mt: 2 }}>
              {items.map((t) => (
                <ListItem key={t} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleOutlineIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t} />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={8}>
            <PaywallCard />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
