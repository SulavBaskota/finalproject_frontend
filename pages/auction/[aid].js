import { useRouter } from "next/router";
import { useWeb3Contract, useMoralis } from "react-moralis";
import {
  CardActions,
  Button,
  Typography,
  Box,
  TextField,
  Stack,
} from "@mui/material";
import AuctionDetailCard from "../../components/AuctionDetailCard";
import { useState, useEffect } from "react";
import { blindAuctionAbi } from "../../constants";

export default function Auction() {
  const router = useRouter();
  const { aid } = router.query;
  const { runContractFunction } = useWeb3Contract();
  const { isWeb3Enabled } = useMoralis();
  const [auctionDetail, setAuctionDetail] = useState([]);
  const [trueBid, setTrueBid] = useState("");
  const [bidValue, setBidValue] = useState("");
  const [secret, setSecret] = useState("");

  const options = {
    abi: blindAuctionAbi,
    contractAddress: aid,
    functionName: "getAuctionDetails",
    params: {},
  };

  useEffect(() => {
    updateUIValues();
  }, [isWeb3Enabled]);

  const updateUIValues = async () => {
    if (!isWeb3Enabled) return;
    const auctionDetailFromCall = await runContractFunction({
      params: options,
    });
    if (auctionDetailFromCall) {
      setAuctionDetail([auctionDetailFromCall]);
    }
  };

  const BidComponent = () => (
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
      <Box>
        <Button variant="contained" color="secondary">
          Bid
        </Button>
      </Box>
    </Stack>
  );

  const RevealComponent = () => (
    <Stack spacing={2}>
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
      <Box>
        <Button variant="contained" color="secondary">
          Reveal Bid
        </Button>
      </Box>
    </Stack>
  );

  const WithdrawComponent = () => (
    <Box>
      <Button variant="contained">Withdraw</Button>
    </Box>
  );

  const CloseAuctionComponent = () => (
    <Box>
      <Button variant="contained">Close Auction</Button>
    </Box>
  );

  const CardChildComponent = () => (
    <>
      <BidComponent />
      <RevealComponent />
      <WithdrawComponent />
      <CloseAuctionComponent />
    </>
  );

  return (
    <Box>
      {auctionDetail &&
        auctionDetail.map((item, index) => (
          <AuctionDetailCard
            item={item}
            index={index}
            children={<CardChildComponent />}
          />
        ))}
    </Box>
  );
}
