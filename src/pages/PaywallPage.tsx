import { Container, Box, Typography } from "@mui/material";
import PaywallCard from "../components/PaywallCard";

export default function PaywallPage() {
  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={6} mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Go Pro: log without limits
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Unlimited entries, caregiver sharing, CSV export & more. Cancel
          anytime.
        </Typography>
      </Box>
      <PaywallCard />
    </Container>
  );
}
