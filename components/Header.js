import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

export default function Header() {
  const {
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    account,
    Moralis,
    deactivateWeb3,
  } = useMoralis();

  useEffect(() => {
    if (
      !isWeb3Enabled &&
      typeof window !== "undefined" &&
      window.localStorage.getItem("provider")
    ) {
      enableWeb3();
    }
    console.log(isWeb3Enabled);
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((newAccount) => {
      console.log(`Account changed to ${newAccount}`);
      if (newAccount == null) {
        window.localStorage.removeItem("provider");
        deactivateWeb3();
        console.log("Null Account found");
      }
    });
  }, []);

  const handleConnect = async () => {
    const ret = await enableWeb3();
    if (typeof ret !== "undefined") {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("provider", "metamask");
      }
    }
  };

  const handleDisconnect = async () => {
    if (typeof window !== "undefined" && isWeb3Enabled) {
      window.localStorage.removeItem("provider");
      deactivateWeb3();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Navbar />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            D-Auction
          </Typography>
          {account ? (
            <>
              <Button color="secondary" onClick={handleDisconnect}>
                {account.slice(0, 6)}...
                {account.slice(account.length - 4)}
                <AccountBoxIcon fontSize="large" />
              </Button>
            </>
          ) : (
            <Button
              color="secondary"
              variant="contained"
              onClick={handleConnect}
              disabled={isWeb3EnableLoading}
            >
              Connect Wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
