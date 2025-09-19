import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import LOGOImage from "../assets/images/logo.png";

export function HeaderBar() {
  const { pathname } = useLocation();
  const onRecipes = pathname.startsWith("/recipes");

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
        <img src={LOGOImage} width={80} alt="logo" />

        <Button
          component={Link}
          to="/log"
          color={onRecipes ? "inherit" : "secondary"}
          variant={onRecipes ? "text" : "contained"}
        >
          Food Log
        </Button>
        <Button
          component={Link}
          to="/recipes"
          color={onRecipes ? "secondary" : "inherit"}
          variant={onRecipes ? "contained" : "text"}
        >
          Recipes
        </Button>
      </Toolbar>
    </AppBar>
  );
}
