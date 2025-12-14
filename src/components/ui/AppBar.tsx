import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Stack,
  Toolbar,
  AppBar,
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LOGOImage from "../../assets/images/logo.png";

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
            justifyContent="center"
            spacing={1.2}
            sx={{
              width: "280px",
              marginLeft: "-24px",
              borderRight: "1px solid rgba(0, 0, 0, 0.12)!important",
            }}
          >
            <img src={LOGOImage} width={80} alt="logo" />
          </Stack>

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
