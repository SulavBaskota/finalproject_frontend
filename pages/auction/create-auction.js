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
import { useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import ImageUpload from "../../components/ImageUpload";

const currentTime = new Date();
export default function CreateAuction() {
  const [startTime, setStartTime] = useState(dayjs(currentTime));
  const [endTime, setEndTime] = useState(dayjs(currentTime));
  const [minimumBid, setMinimumBid] = useState("0.1");
  const [images, setImages] = useState([]);

  const web3storageClient = new Web3Storage({
    token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN,
  });

  const options = {
    abi: blindAuctionFactoryAbi,
    contractAddress: blindAuctionFactoryContractAddress,
    functionName: "createBlindAuctionContract",
    params: {},
  };

  const { runContractFunction } = useWeb3Contract();

  const handleCreateAuction = async () => {
    const cid = await web3storageClient.put(images);
    options.params = {
      startTime: Math.floor(startTime.valueOf() / 1000),
      endTime: Math.floor(endTime.valueOf() / 1000),
      minimumBid: ethers.utils.parseEther(minimumBid),
      cid: cid,
    };
    await runContractFunction({
      params: options,
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
    <Stack spacing={2}>
      <Typography variant="h3">Create New Auction</Typography>
      <Divider />
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="flex-start"
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
        <ImageUpload images={images} setImages={setImages} />
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreateAuction}
            size="large"
          >
            Submit
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
}
