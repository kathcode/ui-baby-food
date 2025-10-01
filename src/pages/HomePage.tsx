import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import OverviewPage from "./OverviewPage";

export default function HomePage() {
  return (
    <Box sx={{ py: 3 }}>
      <OverviewPage />
    </Box>
  );
}
