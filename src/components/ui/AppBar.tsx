import {
  Avatar,
  Badge,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
  AppBar,
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export const AppBarComponent = ({
  setOpen,
  mdUp,
}: {
  setOpen: (open: boolean) => void;
  mdUp: boolean;
}) => {
  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          color: "text.primary",
        }}
      >
        <Toolbar>
          {!mdUp && (
            <IconButton
              edge="start"
              onClick={() => setOpen(true)}
              sx={{ mr: 1.5 }}
            >
              <MenuRoundedIcon />
            </IconButton>
          )}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.2}
            sx={{ mr: 2 }}
          >
            Logo
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              SnugBitesBaby
            </Typography>
          </Stack>

          <TextField
            fullWidth
            placeholder="Search foods, logs, caregivers…"
            size="small"
            sx={{ maxWidth: 520 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ flexGrow: 1 }} />
          <IconButton>
            <Badge color="error" variant="dot">
              <NotificationsNoneRoundedIcon />
            </Badge>
          </IconButton>
          <Avatar sx={{ ml: 1.5, width: 32, height: 32 }}>LM</Avatar>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default AppBar;
