import {
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Typography,
  useTheme,
} from "@mui/material";

export function Metric({
  title,
  value,
  caption,
  color = "primary",
  progress,
}: {
  title: string;
  value: string | number;
  caption?: string;
  color?: "primary" | "success" | "warning";
  progress?: number; // 0-100 optional
}) {
  const theme = useTheme();
  const palette =
    color === "success"
      ? theme.palette.success
      : color === "warning"
      ? theme.palette.warning
      : theme.palette.primary;

  return (
    <Card
      sx={{
        height: "100%",
        background:
          color === "primary"
            ? `linear-gradient(180deg, ${theme.palette.primary.light}14, transparent)`
            : color === "success"
            ? `linear-gradient(180deg, ${theme.palette.success.light}14, transparent)`
            : `linear-gradient(180deg, ${theme.palette.warning.light}18, transparent)`,
        borderColor: `${palette.main}22`,
      }}
      variant="outlined"
    >
      <CardHeader
        title={<Typography variant="subtitle2">{title}</Typography>}
        sx={{ pb: 0.5 }}
      />
      <CardContent sx={{ pt: 0.5 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
          {value}
        </Typography>
        {caption && (
          <Typography variant="body2" color="text.secondary">
            {caption}
          </Typography>
        )}
        {typeof progress === "number" && (
          <Box sx={{ mt: 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 8,
                backgroundColor: `${palette.main}22`,
                "& .MuiLinearProgress-bar": { backgroundColor: palette.main },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
