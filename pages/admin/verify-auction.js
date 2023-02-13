import { Stack, Button, TextField, Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  blindAuctionFactoryAbi,
  blindAuctionFactoryContractAddress,
  blindAuctionAbi,
  AUCTIONSTATE,
} from "../../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";
import AuctionDetailCard from "../../components/AuctionDetailCard";

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
        if (auctionDetailsFromCall._auctionState === AUCTIONSTATE.UNVERIFIED) {
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

  const RejectAuctionForm = ({ contractAddress }) => (
    <Stack
      spacing={2}
      direction="row"
      component="form"
      name={`rejectForm-${contractAddress}`}
      autoComplete="off"
      onSubmit={(event) => handleRejection(event, contractAddress)}
    >
      <TextField
        name={`rejectMessage-${contractAddress}`}
        size="small"
        label="Reject Message"
        required
      />
      <Button variant="outlined" color="error" type="submit">
        Reject
      </Button>
    </Stack>
  );

  const CardChildComponent = ({ contractAddress }) => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Stack spacing={2} alignItems="flex-end">
        <Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleVerification(contractAddress)}
          >
            Verify
          </Button>
        </Box>
        <RejectAuctionForm contractAddress={contractAddress} />
      </Stack>
    </Box>
  );

  return (
    <Stack spacing={2}>
      {unVerifiedAuctions &&
        unVerifiedAuctions.map((item, index) => (
          <Box key={index}>
            <AuctionDetailCard
              item={item}
              children={
                <CardChildComponent contractAddress={item._contractAddress} />
              }
            />
          </Box>
        ))}
    </Stack>
  );
}
