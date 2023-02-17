import { useRouter } from "next/router";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { blindAuctionAbi, AUCTIONSTATE } from "../../../constants";
import AuctionDetailCard from "../../../components/AuctionDetailCard";
import { Box, Stack, Button, TextField } from "@mui/material";

export default function EvaluateAuction() {
  const router = useRouter();
  const { eaid } = router.query;
  const { runContractFunction } = useWeb3Contract();
  const { isWeb3Enabled } = useMoralis();
  const [auctionDetail, setAuctionDetail] = useState(null);

  let options;

  useEffect(() => {
    updateUIValues();
  }, [isWeb3Enabled]);

  const updateUIValues = async () => {
    if (!isWeb3Enabled) return;
    options = {
      abi: blindAuctionAbi,
      contractAddress: eaid,
      functionName: "getAuctionDetails",
      params: {},
    };
    const auctionDetailFromCall = await runContractFunction({
      params: options,
    });
    if (
      auctionDetailFromCall &&
      auctionDetailFromCall._auctionState === AUCTIONSTATE.UNVERIFIED
    ) {
      setAuctionDetail(auctionDetailFromCall);
    } else {
      router.push("/404");
    }
  };

  const handleVerification = async () => {
    options = {
      abi: blindAuctionAbi,
      contractAddress: eaid,
      functionName: "verifyAuction",
      params: {},
    };

    await runContractFunction({
      params: options,
      onSuccess: handleSuccess,
      onError: (error) => console.log(error),
    });
  };

  const handleRejection = async (event) => {
    event.preventDefault();
    const rejectMessage = new FormData(event.currentTarget).get(
      "rejectMessage"
    );

    options = {
      abi: blindAuctionAbi,
      contractAddress: eaid,
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
      console.log(txResponse);
      updateUIValues();
    } catch (error) {
      console.log(error);
    }
  };

  const CardChildComponent = () => (
    <Stack component="form" onSubmit={handleRejection} spacing={2}>
      <TextField
        required
        label="Reject Message"
        name="rejectMessage"
        multiline
        rows={3}
      />
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" color="error" type="submit">
          Reject
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleVerification}
        >
          Verify
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <>
      {auctionDetail && (
        <AuctionDetailCard
          item={auctionDetail}
          childComponent={<CardChildComponent />}
        />
      )}
    </>
  );
}
