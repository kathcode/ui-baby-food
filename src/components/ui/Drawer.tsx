import {
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocalDiningRoundedIcon from "@mui/icons-material/LocalDiningRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { useNavigate } from "react-router-dom";

// ---------- Sidebar items ----------
const nav = [
  { icon: <HomeRoundedIcon />, label: "Dashboard", link: "/dashboard" },
  { icon: <LocalDiningRoundedIcon />, label: "Log", link: "/log" },
  { icon: <FavoriteRoundedIcon />, label: "Recipes", link: "/recipes" },
  { icon: <PictureAsPdfRoundedIcon />, label: "Reports", link: "/report" },
  { icon: <InsightsRoundedIcon />, label: "Insights", link: "/" },
  { icon: <PeopleAltRoundedIcon />, label: "Caregivers", link: "/" },
  { icon: <SettingsRoundedIcon />, label: "Settings", link: "/" },
];

export const DrawerComponent = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <List sx={{ px: 1, py: 1.5, pt: 12 }}>
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
            onClick={() => navigate(item.link)}
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
};
