import { Typography, Stack, Paper, Box, Grid } from "@mui/material";
import { ethers } from "ethers";
import dayjs from "dayjs";
import AuctionImagesCarousel from "./AuctionImageCarousel";

export default function AuctionDetailCard({ item, children }) {
  return (
    <Box display="flex" justifyContent="center">
      <Box
        p={2}
        component={Paper}
        elevation={4}
        boxShadow={6}
        width={{ xs: 400, sm: 600, md: 900 }}
      >
        <Grid container spacing={4} columns={{ xs: 2, md: 12 }}>
          <Grid item xs={2} md={7}>
            <Stack spacing={2}>
              <AuctionImagesCarousel cid={item._cid} compact={false} />
              <Typography>Address: {item._contractAddress}</Typography>
              <Typography>Seller: {item._seller}</Typography>
              <Stack direction="row" spacing={2}>
                <Typography>
                  Start Time:{" "}
                  {dayjs.unix(item._startTime).format("DD/MM/YYYY HH:mm")}
                </Typography>
                <Typography>
                  End Time:{" "}
                  {dayjs.unix(item._endTime).format("DD/MM/YYYY HH:mm")}
                </Typography>
              </Stack>
              <Typography>
                Mimimum Bid:{" "}
                {ethers.utils.formatUnits(item._minimumBid, "ether")} ETH
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={2} md={5}>
            <Stack spacing={2}>{children}</Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
