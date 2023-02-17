import { Box, Button } from "@mui/material";
import Link from "../src/Link";

export default function AuctionMediaCardButton({ href, text }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="contained"
        color="secondary"
        component={Link}
        href={href}
      >
        {text}
      </Button>
    </Box>
  );
}
