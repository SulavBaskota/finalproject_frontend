import { Box, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import {
  blindAuctionFactoryAbi,
  blindAuctionFactoryContractAddress,
  blindAuctionAbi,
  AUCTIONSTATE,
} from "../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";
import AuctionMediaCard from "../components/AuctionMediaCard";
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
        href={`/auction/${encodeURIComponent(contractAddress)}`}
      >
        Learn More
      </Button>
    </Box>
  );

  return (
    <Grid container spacing={2} columns={{ xs: 2, md: 6, xl: 12 }}>
      {openAuctions &&
        openAuctions.map((item, index) => (
          <Grid item key={index} xs={2} md={3} xl={4}>
            <AuctionMediaCard
              item={item}
              children={
                <CardChildComponent contractAddress={item._contractAddress} />
              }
            />
          </Grid>
        ))}
    </Grid>
  );
}
