import { useRouter } from "next/router";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { Box } from "@mui/material";
import AuctionDetailCard from "../../components/AuctionDetailCard";
import { useState, useEffect } from "react";
import { blindAuctionAbi } from "../../constants";
import BidComponent from "../../components/BidComponent";
import RevealComponent from "../../components/RevealComponent";
import WithdrawComponent from "../../components/WithdrawComponent";
import EndAuctionComponent from "../../components/EndAuctionComponent";

export default function Auction() {
  const router = useRouter();
  const { aid } = router.query;
  const { runContractFunction } = useWeb3Contract();
  const { isWeb3Enabled } = useMoralis();
  const [auctionDetail, setAuctionDetail] = useState([]);

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

  const CardChildComponent = ({ aid }) => (
    <>
      <BidComponent aid={aid} />
      <RevealComponent aid={aid} />
      <WithdrawComponent aid={aid} />
      <EndAuctionComponent aid={aid} />
    </>
  );

  return (
    <Box>
      {auctionDetail &&
        auctionDetail.map((item, index) => (
          <AuctionDetailCard
            item={item}
            index={index}
            children={<CardChildComponent aid={aid} />}
          />
        ))}
    </Box>
  );
}
