import { Typography, Stack, Paper, Box, Grid } from "@mui/material";
import { ethers } from "ethers";
import dayjs from "dayjs";
import AuctionImagesCarousel from "./AuctionImageCarousel";
import StyledBox from "./StyledBox";

export default function AuctionDetailCard({ item, childComponent }) {
  return (
    <StyledBox>
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
              <Typography noWrap>Address: {item._contractAddress}</Typography>
              <Typography noWrap>Seller: {item._seller}</Typography>
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
            <Stack spacing={2}>{childComponent}</Stack>
          </Grid>
        </Grid>
      </Box>
    </StyledBox>
  );
}
