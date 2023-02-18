import { Typography, Stack, Paper, Box } from "@mui/material";
import { ethers } from "ethers";
import dayjs from "dayjs";
import AuctionImagesCarousel from "./AuctionImageCarousel";
import StyledBox from "./StyledBox";

export default function AuctionMediaCard({ item, childComponent }) {
  return (
    <StyledBox>
      <Box p={2} component={Paper} elevation={4} boxShadow={6} width={300}>
        <Stack spacing={2}>
          <AuctionImagesCarousel cid={item._cid} compact={true} />
          <Typography noWrap>Address: {item._contractAddress}</Typography>
          <Typography>
            Start Time: {dayjs.unix(item._startTime).format("DD/MM/YYYY HH:mm")}
          </Typography>
          <Typography>
            End Time: {dayjs.unix(item._endTime).format("DD/MM/YYYY HH:mm")}
          </Typography>
          <Typography>
            Mimimum Bid: {ethers.utils.formatUnits(item._minimumBid, "ether")}{" "}
            ETH
          </Typography>
          {childComponent}
        </Stack>
      </Box>
    </StyledBox>
  );
}
