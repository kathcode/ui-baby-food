import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Tooltip,
  Button,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import ProTeaser from "../components/sections/ProTeaser";

export default function HomePage() {
  return (
    <Box sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5">Lil Matt's Food Tracker</Typography>
      </Box>
      <ProTeaser />
    </Box>
  );
}
