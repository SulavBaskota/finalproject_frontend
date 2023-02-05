import {
  Stack,
  Typography,
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  blindAuctionFactoryAbi,
  blindAuctionFactoryContractAddress,
  blindAuctionAbi,
} from "../../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";

export default function VerifyAuction() {
  const [unVerifiedAuctions, setUnVerifiedAuctions] = useState([]);
  const { isWeb3Enabled } = useMoralis();

  const { runContractFunction } = useWeb3Contract();

  let options;

  useEffect(() => {
    updateUIValues();
  }, [isWeb3Enabled]);

  const updateUIValues = async () => {
    if (!isWeb3Enabled) return;

    options = {
      abi: blindAuctionFactoryAbi,
      contractAddress: blindAuctionFactoryContractAddress,
      functionName: "getBlindAuctionAddresses",
      params: {},
    };

    const auctionArrayFromCall = await runContractFunction({
      params: options,
    });

    if (auctionArrayFromCall) {
      options = {
        abi: blindAuctionAbi,
        contractAddress: "",
        functionName: "getAuctionDetails",
        params: {},
      };

      let unVerifiedAuctionsFromCall = [];

      auctionArrayFromCall.forEach(async (element) => {
        options.contractAddress = element;
        const auctionDetailsFromCall = await runContractFunction({
          params: options,
        });
        if (auctionDetailsFromCall._auctionState === 0) {
          unVerifiedAuctionsFromCall.push(auctionDetailsFromCall);
        }
      });
      setUnVerifiedAuctions(unVerifiedAuctionsFromCall);
    }
  };

  const handleVerification = async (contractAddress) => {
    options = {
      abi: blindAuctionAbi,
      contractAddress: contractAddress,
      functionName: "verifyAuction",
      params: {},
    };

    await runContractFunction({
      params: options,
      onSuccess: handleSuccess,
      onError: (error) => console.log(error),
    });
  };

  const handleRejection = async (event, contractAddress) => {
    event.preventDefault();

    const rejectMessage = new FormData(event.currentTarget).get(
      `rejectMessage-${contractAddress}`
    );

    options = {
      abi: blindAuctionAbi,
      contractAddress: contractAddress,
      functionName: "rejectAuction",
      params: { _rejectMessage: rejectMessage },
    };

    await runContractFunction({
      params: options,
      onSuccess: handleSuccess,
      onError: (error) => console.log(error),
    });
  };

  const handleSuccess = async (tx) => {
    try {
      const txResponse = await tx.wait();
      console.log(JSON.stringify(txResponse.logs));
      updateUIValues();
    } catch (error) {
      console.log(error);
    }
  };

  const RejectAuctionForm = ({ item }) => (
    <Stack
      spacing={2}
      direction="row"
      component="form"
      name={`rejectForm-${item._contractAddress}`}
      autoComplete="off"
      onSubmit={(event) => handleRejection(event, item._contractAddress)}
    >
      <TextField
        name={`rejectMessage-${item._contractAddress}`}
        size="small"
        label="Reject Message"
        required
      />
      <Button variant="outlined" color="error" type="submit">
        Reject
      </Button>
    </Stack>
  );

  return (
    <Stack spacing={2}>
      {unVerifiedAuctions &&
        unVerifiedAuctions.map((item, index) => (
          <Card key={index} elevation={4}>
            <CardContent>
              <Typography>Address: {item._contractAddress}</Typography>
              <Typography>Seller: {item._seller}</Typography>
              <Typography>Start Time: {parseInt(item._startTime)}</Typography>
              <Typography>End Time: {parseInt(item._endTime)}</Typography>
              <Typography>Mimimum Bid: {parseInt(item._minimumBid)}</Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Stack spacing={2} alignItems="flex-end">
                <Box>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleVerification(item._contractAddress)}
                  >
                    Verify
                  </Button>
                </Box>
                <RejectAuctionForm item={item} />
              </Stack>
            </CardActions>
          </Card>
        ))}
    </Stack>
  );
}
