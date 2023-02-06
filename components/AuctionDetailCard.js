import { Typography, Stack, Paper, Box } from "@mui/material";
import { ethers } from "ethers";
import dayjs from "dayjs";

export default function AuctionDetailCard({ item, index, children }) {
  return (
    <Paper key={index} elevation={4}>
      <Box p={2}>
        <Stack spacing={2}>
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
    </Paper>
  );
}
