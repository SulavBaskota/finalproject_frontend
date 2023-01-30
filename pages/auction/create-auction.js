import {
  Stack,
  Typography,
  Box,
  Divider,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import {
  blindAuctionFactoryAbi,
  blindAuctionFactoryContractAddress,
} from "../../constants";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { ethers } from "ethers";

const currentTime = new Date();
export default function CreateAuction() {
  const [startTime, setStartTime] = useState(dayjs(currentTime));
  const [endTime, setEndTime] = useState(dayjs(currentTime));
  const [minimumBid, setMinimumBid] = useState("0.1");
  const [auctionArray, setAuctionArray] = useState([]);
  const { isWeb3Enabled } = useMoralis();

  const { runContractFunction: createBlindAuctionContract } = useWeb3Contract({
    abi: blindAuctionFactoryAbi,
    contractAddress: blindAuctionFactoryContractAddress,
    functionName: "createBlindAuctionContract",
    params: {
      startTime: startTime.valueOf(),
      endTime: endTime.valueOf(),
      minimumBid: minimumBid ? ethers.utils.parseEther(minimumBid) : 0,
    },
  });

  const { runContractFunction: getBlindAuctionAddresses } = useWeb3Contract({
    abi: blindAuctionFactoryAbi,
    contractAddress: blindAuctionFactoryContractAddress,
    functionName: "getBlindAuctionAddresses",
    params: {},
  });

  useEffect(() => {
    updateUIValues();
  }, [isWeb3Enabled]);

  const updateUIValues = async () => {
    const auctionArrayFromCall = await getBlindAuctionAddresses();
    setAuctionArray(auctionArrayFromCall);
  };

  const handleCreateAuction = async () => {
    await createBlindAuctionContract({
      onSuccess: handleCreateAuctionSuccess,
      onError: (error) => console.log(error),
    });
  };

  const handleCreateAuctionSuccess = async (tx) => {
    try {
      const txResponse = await tx.wait();
      console.log(JSON.stringify(txResponse.logs));
      updateUIValues();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Stack spacing={2} component={Paper} elevation={2} p={2} border={2}>
      <Typography variant="h3">Create New Auction</Typography>
      <Divider />
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="Start Time"
              value={startTime}
              onChange={(newValue) => {
                setStartTime(newValue);
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="End Time"
              value={endTime}
              onChange={(newValue) => {
                setEndTime(newValue);
              }}
            />
          </LocalizationProvider>
        </Stack>
        <TextField
          label="Minimum Bid in ETH"
          value={minimumBid}
          autoComplete="off"
          type="number"
          onChange={(e) => setMinimumBid(e.target.value)}
        />
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreateAuction}
          >
            Submit
          </Button>
        </Box>
        {isWeb3Enabled &&
          auctionArray &&
          auctionArray.map((item, index) => (
            <Typography key={index}>{item}</Typography>
          ))}
      </Stack>
    </Stack>
  );
}
