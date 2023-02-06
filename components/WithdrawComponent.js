import { Box, Button } from "@mui/material";
import { useWeb3Contract } from "react-moralis";
import { blindAuctionAbi } from "../constants";

export default function WithdrawComponent({ aid }) {
  const { runContractFunction } = useWeb3Contract();

  const options = {
    abi: blindAuctionAbi,
    contractAddress: aid,
    functionName: "withdraw",
    params: {},
  };

  const handleClick = async () => {
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
    <Box>
      <Button variant="contained" onClick={handleClick}>
        Withdraw
      </Button>
    </Box>
  );
}
