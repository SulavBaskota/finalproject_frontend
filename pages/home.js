import { Box, Button, CardActions, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  blindAuctionFactoryAbi,
  blindAuctionFactoryContractAddress,
  blindAuctionAbi,
  AUCTIONSTATE,
} from "../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";
import AuctionDetailCard from "../components/AuctionDetailCard";
import Link from "../src/Link";

export default function Home() {
  const [openAuctions, setOpenAuctions] = useState([]);
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

      let openAuctionsFromCall = [];

      auctionArrayFromCall.forEach(async (element) => {
        options.contractAddress = element;
        const auctionDetailsFromCall = await runContractFunction({
          params: options,
        });
        if (auctionDetailsFromCall._auctionState === AUCTIONSTATE.OPEN) {
          openAuctionsFromCall.push(auctionDetailsFromCall);
        }
      });
      setOpenAuctions(openAuctionsFromCall);
    }
  };

  const CardChildComponent = ({ contractAddress }) => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="contained"
        color="secondary"
        component={Link}
        href={{
          pathname: "/auction/[aid]",
          query: { aid: encodeURIComponent(contractAddress) },
        }}
      >
        Learn More
      </Button>
    </Box>
  );

  return (
    <Stack spacing={2}>
      {openAuctions &&
        openAuctions.map((item, index) => (
          <AuctionDetailCard
            item={item}
            index={index}
            children={
              <CardChildComponent contractAddress={item._contractAddress} />
            }
          />
        ))}
    </Stack>
  );
}
