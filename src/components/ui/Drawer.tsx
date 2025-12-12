import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocalDiningRoundedIcon from "@mui/icons-material/LocalDiningRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

// ---------- Sidebar items ----------
const nav = [
  { icon: <HomeRoundedIcon />, label: "Dashboard" },
  { icon: <LocalDiningRoundedIcon />, label: "Log" },
  { icon: <NoteAddRoundedIcon />, label: "New Food" },
  { icon: <FavoriteRoundedIcon />, label: "Recipes" },
  { icon: <InsightsRoundedIcon />, label: "Insights" },
  { icon: <PictureAsPdfRoundedIcon />, label: "Reports" },
  { icon: <PeopleAltRoundedIcon />, label: "Caregivers" },
  { icon: <SettingsRoundedIcon />, label: "Settings" },
];

export const DrawerComponent = (
  <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <Toolbar sx={{ px: 2 }}>
      <Stack direction="row" spacing={1.2} alignItems="center">
        Logo
        <Box>
          <Typography variant="subtitle1" fontWeight={800} lineHeight={1}>
            SnugBitesBaby
          </Typography>
          <Chip size="small" label="Beta" sx={{ height: 20, mt: 0.5 }} />
        </Box>
      </Stack>
    </Toolbar>
    <Divider />
    <List sx={{ px: 1, py: 1.5 }}>
      {nav.map((item) => (
        <ListItemButton
          key={item.label}
          sx={{
            mb: 0.5,
            borderRadius: 2,
            "&.Mui-selected, &:hover": {
              backgroundColor: "primary.main",
              color: "#fff",
            },
            "&.Mui-selected .MuiListItemIcon-root, &:hover .MuiListItemIcon-root":
              { color: "#fff" },
          }}
          selected={item.label === "Dashboard"}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
    <Box sx={{ flexGrow: 1 }} />
    <Box sx={{ p: 2 }}>
      <Card
        variant="outlined"
        sx={{ borderColor: "primary.main", borderWidth: 1 }}
      >
        <CardContent>
          <Typography variant="subtitle2" fontWeight={700}>
            Founding Families
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Join the beta and get 3 months Pro.
          </Typography>
          <Button fullWidth sx={{ mt: 1.5 }} variant="contained">
            Join beta
          </Button>
        </CardContent>
      </Card>
    </Box>
  </Box>
);
