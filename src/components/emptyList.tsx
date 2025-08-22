import { Box, Typography } from "@mui/material";
import type { ReactElement } from "react";
import type React from "react";

export const EmptyList = ({
  title,
  children,
}: {
  title: string;
  children: ReactElement;
}) => (
  <Box
    sx={{
      border: "1px dashed",
      borderColor: "divider",
      borderRadius: 2,
      p: 4,
      textAlign: "center",
      marginBottom: 3,
    }}
  >
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {children}
    </Typography>
  </Box>
);
