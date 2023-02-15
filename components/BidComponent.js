import { Stack, TextField, Box, Button } from "@mui/material";
import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { blindAuctionAbi } from "../constants";
import { ethers } from "ethers";

export default function BidComponent({ aid }) {
  const [trueBid, setTrueBid] = useState("");
  const [bidValue, setBidValue] = useState("");
  const [secret, setSecret] = useState("");

  const { runContractFunction } = useWeb3Contract();

  const options = {
    abi: blindAuctionAbi,
    contractAddress: aid,
    functionName: "bid",
    params: {},
    msgValue: "",
  };

  const handleClick = async () => {
    const secretBytes = ethers.utils.id(secret);
    const blindedBid = ethers.utils.solidityKeccak256(
      ["uint", "bytes32"],
      [ethers.utils.parseEther(trueBid), secretBytes]
    );

    options.params = {
      _blindedBid: blindedBid,
    };
    options.msgValue = ethers.utils.parseEther(bidValue);

    await runContractFunction({
      params: options,
      onSuccess: handleSuccess,
      onError: (error) => console.log(error),
    });
  };

  const handleSuccess = async (tx) => {
    try {
      const txResponse = tx.wait();
      console.log(txResponse);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        type="number"
        size="small"
        label="Bid Value"
        value={bidValue}
        onChange={(e) => setBidValue(e.target.value)}
      />
      <TextField
        type="number"
        size="small"
        label="True Bid"
        value={trueBid}
        onChange={(e) => setTrueBid(e.target.value)}
      />
      <TextField
        type="password"
        size="small"
        label="Secret"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
      />
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" color="secondary" onClick={handleClick}>
          Bid
        </Button>
      </Box>
    </Stack>
  );
}
