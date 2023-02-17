import { Grid } from "@mui/material";

export default function StyledGrid({ children }) {
  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 2, md: 6, xl: 12 }}
    >
      {children}
    </Grid>
  );
}
