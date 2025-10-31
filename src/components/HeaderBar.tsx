import { AppBar, Toolbar, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import LOGOImage from "../assets/images/logo.png";

export function HeaderBar() {
  const { pathname } = useLocation();
  console.log(pathname);

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
        <img src={LOGOImage} width={80} alt="logo" />
        <Button
          component={Link}
          to="/"
          color={pathname === "/" ? "secondary" : "inherit"}
          variant={pathname === "/" ? "contained" : "text"}
        >
          Dashboard
        </Button>
        <Button
          component={Link}
          to="/log"
          color={pathname === "/log" ? "secondary" : "inherit"}
          variant={pathname === "/log" ? "contained" : "text"}
        >
          Food Log
        </Button>
        <Button
          component={Link}
          to="/recipes"
          color={pathname === "/recipes" ? "secondary" : "inherit"}
          variant={pathname === "/recipes" ? "contained" : "text"}
        >
          Recipes
        </Button>
        <Button
          component={Link}
          to="/checklist"
          color={pathname === "/checklist" ? "secondary" : "inherit"}
          variant={pathname === "/checklist" ? "contained" : "text"}
        >
          Checklist
        </Button>
        <Button
          component={Link}
          to="/report"
          color={pathname === "/report" ? "secondary" : "inherit"}
          variant={pathname === "/report" ? "contained" : "text"}
        >
          Report
        </Button>
      </Toolbar>
    </AppBar>
  );
}
