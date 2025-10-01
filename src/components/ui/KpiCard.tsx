import * as React from "react";
import { Card, Box, Typography } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

type KpiColor = "primary" | "secondary" | "success" | "warning" | "info";

type Props = {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  /** Uses theme palette keys; defaults to 'primary' */
  color?: KpiColor;
  loading?: boolean;
};

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
  loading,
}: Props) {
  const theme = useTheme();
  const palette = theme.palette[color];

  // soft, theme-based surface
  const bg = `linear-gradient(135deg, ${alpha(palette.light, 0.12)} 0%, ${alpha(
    palette.main,
    0.08
  )} 100%)`;

  return (
    <Card
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 1,
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.paper",
        backgroundImage: bg,
        transition: "transform .18s ease, box-shadow .18s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          minHeight: 84,
        }}
      >
        {/* Icon bubble (subtle, theme-aware) */}
        {icon && (
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(palette.main, 0.14),
              color: palette.main,
              flexShrink: 0,
            }}
          >
            <Box sx={{ "& svg": { fontSize: 24 } }}>{icon}</Box>
          </Box>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="overline"
            sx={{
              letterSpacing: ".08em",
              color: alpha(theme.palette.text.primary, 0.7),
            }}
          >
            {title}
          </Typography>

          {loading ? (
            <Box
              sx={{
                mt: 0.5,
                height: 38,
                borderRadius: 1,
                background: `linear-gradient(90deg, ${alpha(
                  theme.palette.background.default,
                  0.6
                )}, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(
                  theme.palette.background.default,
                  0.6
                )})`,
                backgroundSize: "200% 100%",
                animation: "shimmer 1.6s infinite",
                "@keyframes shimmer": {
                  "0%": { backgroundPosition: "200% 0" },
                  "100%": { backgroundPosition: "-200% 0" },
                },
              }}
            />
          ) : (
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ mt: 0.5, color: theme.palette.text.primary }}
            >
              {value}
            </Typography>
          )}

          {subtitle && (
            <Typography
              variant="caption"
              sx={{ color: alpha(theme.palette.text.primary, 0.6) }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
}
