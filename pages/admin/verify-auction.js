import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import {
  blindAuctionFactoryAbi,
  blindAuctionFactoryContractAddress,
  blindAuctionAbi,
  AUCTIONSTATE,
} from "../../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";
import AuctionMediaCard from "../../components/AuctionMediaCard";
import StyledGrid from "../../components/StyledGrid";
import AuctionMediaCardButton from "../../components/AuctionMediaCardButton";

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

  const CardChildComponent = ({ contractAddress }) => (
    <AuctionMediaCardButton
      href={`/admin/evaluate/${encodeURIComponent(contractAddress)}`}
      text="Evaluate"
    />
  );

  return (
    <StyledGrid>
      {unVerifiedAuctions &&
        unVerifiedAuctions.map((item, index) => (
          <Grid item key={index} xs={2} md={3} xl={4}>
            <AuctionMediaCard
              item={item}
              childComponent={
                <CardChildComponent contractAddress={item._contractAddress} />
              }
            />
          </Grid>
        ))}
    </StyledGrid>
  );
}
