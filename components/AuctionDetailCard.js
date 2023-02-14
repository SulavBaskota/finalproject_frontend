import { Typography, Stack, Paper, Box } from "@mui/material";
import { ethers } from "ethers";
import dayjs from "dayjs";
import AuctionImagesCarousel from "./AuctionImageCarousel";

export default function AuctionDetailCard({ item, children }) {
  return (
    <Box display="flex" justifyContent="center">
      <Box p={2} component={Paper} elevation={4} boxShadow={6} width={600}>
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
              End Time: {dayjs.unix(item._endTime).format("DD/MM/YYYY HH:mm")}
            </Typography>
          </Stack>
          <Typography>
            Mimimum Bid: {ethers.utils.formatUnits(item._minimumBid, "ether")}{" "}
            ETH
          </Typography>
          {children}
        </Stack>
      </Box>
    </Box>
  );
}
