import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { ethers } from "ethers";
import { useWeb3Contract } from "react-moralis";
import { Web3Storage } from "web3.storage";
import CustomBackdrop from "../../components/CustomBackdrop";
import ImageUpload from "../../components/ImageUpload";
import AuctionDateTimePicker from "../../components/AuctionDateTimePicker";
import {
  blindAuctionFactoryAbi,
  blindAuctionFactoryContractAddress,
} from "../../constants";
import StyledBox from "../../components/StyledBox";

export default function CreateAuction() {
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [minimumBid, setMinimumBid] = useState("0.1");
  const [images, setImages] = useState([]);
  const [compressedImages, setCompressedImages] = useState([]);
  const [showBackdrop, setShowBackdrop] = useState(false);

  const isSubmitButtonDisabled = useMemo(
    () => compressedImages.length === 0,
    [compressedImages]
  );

  const web3storageClient = useMemo(
    () => new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN }),
    []
  );

  const options = useMemo(
    () => ({
      abi: blindAuctionFactoryAbi,
      contractAddress: blindAuctionFactoryContractAddress,
      functionName: "createBlindAuctionContract",
      params: {},
    }),
    []
  );

  const { runContractFunction } = useWeb3Contract();

  const toggleBackdrop = () => setShowBackdrop((prev) => !prev);

  const handleCreateAuctionSuccess = async (tx) => {
    try {
      const txResponse = await tx.wait();
      console.log(txResponse);
      updateUIValues();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateAuction = async () => {
    toggleBackdrop();
    const cid = await web3storageClient.put(compressedImages);
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
    toggleBackdrop();
  };

  const updateUIValues = () => {
    setStartTime(dayjs());
    setEndTime(dayjs());
    setMinimumBid("0.1");
    setImages([]);
    setCompressedImages([]);
  };

  return (
    <>
      {showBackdrop && <CustomBackdrop display={showBackdrop} />}
      <StyledBox>
        <Box
          p={2}
          component={Paper}
          elevation={4}
          boxShadow={6}
          width={{ xs: 400, sm: 600, md: 900 }}
        >
          <Stack spacing={2}>
            <Typography variant="h3">Create New Auction</Typography>
            <Divider />
            <Stack spacing={2}>
              <AuctionDateTimePicker
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
              />
              <Box>
                <TextField
                  label="Minimum Bid in ETH"
                  value={minimumBid}
                  autoComplete="off"
                  type="number"
                  onChange={(e) => setMinimumBid(e.target.value)}
                />
              </Box>
              <ImageUpload
                images={images}
                setImages={setImages}
                setCompressedImages={setCompressedImages}
              />
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCreateAuction}
                  size="large"
                  disabled={isSubmitButtonDisabled}
                >
                  Submit
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </StyledBox>
    </>
  );
}
