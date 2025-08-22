import { Box, Rating, Typography } from "@mui/material";

export const RatingComp = ({ rating }: { rating: number }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.5,
    }}
  >
    <Rating value={rating} readOnly size="small" />
    <Typography variant="body2" color="text.secondary">
      ({rating})
    </Typography>
  </Box>
);
