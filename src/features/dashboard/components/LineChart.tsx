import { Box } from "@mui/material";

// ---------- Sparkline (inline SVG, no extra libs) ----------
export function LineChart({
  data,
  width = 320,
  height = 80,
  stroke = "#1976d2",
  fill = "rgba(25,118,210,0.12)",
}: {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const stepX = width / Math.max(1, data.length - 1);

  const points = data.map((v, i) => {
    const t = (v - min) / Math.max(1, max - min);
    const y = height - 8 - t * (height - 16);
    const x = i * stepX;
    return [x, y] as const;
  });

  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x},${y}`)
    .join(" ");
  const area = `${path} L ${width},${height} L 0,${height} Z`;

  return (
    <Box
      component="svg"
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      sx={{ display: "block" }}
    >
      <path d={area} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={2.5} />
    </Box>
  );
}
