import * as React from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { DrawerComponent } from "../../components/ui/Drawer";
import { AppBarComponent } from "./AppBar";

const drawerWidth = 280;

export default function DashboardPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = React.useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <CssBaseline />
      {/* Top bar */}
      <AppBarComponent setOpen={setOpen} mdUp={mdUp} />

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={mdUp ? "permanent" : "temporary"}
          open={mdUp ? true : open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
        >
          <DrawerComponent />
        </Drawer>
      </Box>
      {/* Main content */}
      {children}
    </Box>
  );
}
