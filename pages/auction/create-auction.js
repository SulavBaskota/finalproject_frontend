import {
  Stack,
  Typography,
  Box,
  Divider,
  TextField,
  Button,
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

export default function CreateAuction() {
  const [biddingTime, setBiddingTime] = useState(null);
  const [revealTime, setRevealTime] = useState(null);
  const [value, setValue] = useState(dayjs("2022"));
  const [auctionArray, setAuctionArray] = useState([]);
  const { isWeb3Enabled } = useMoralis();

  const { runContractFunction: createBlindAuctionContract } = useWeb3Contract({
    abi: blindAuctionFactoryAbi,
    contractAddress: blindAuctionFactoryContractAddress,
    functionName: "createBlindAuctionContract",
    params: { biddingTime: biddingTime, revealTime: revealTime },
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
      await tx.wait(1);
      console.log(JSON.stringify(tx));
      updateUIValues();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h3">Create New Auction</Typography>
      <Divider />
      <Stack spacing={2} alignItems="flex-end">
        <TextField
          required
          id="bidding-time"
          label="Bidding Time in Seconds"
          variant="outlined"
          type="number"
          onChange={(e) => setBiddingTime(e.target.value)}
          fullWidth
          autoComplete="off"
        />
        <Typography>{biddingTime}</Typography>
        <TextField
          required
          id="reveal-time"
          label="Reveal Time in Seconds"
          variant="outlined"
          type="number"
          onChange={(e) => setRevealTime(e.target.value)}
          fullWidth
          autoComplete="off"
        />
        <Typography>{revealTime}</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="Bidding Time"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />
        </LocalizationProvider>
        <Typography>{JSON.stringify(value)}</Typography>
        <Box>
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
            <Typography keyy={index}>{item}</Typography>
          ))}
      </Stack>
    </Stack>
  );
}
