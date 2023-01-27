import { Backdrop, CircularProgress } from "@mui/material";

export default function CustomBackdrop({ display }) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={display}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
