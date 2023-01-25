import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { adminAbi, adminAddress } from "../constants";
import Image from "next/image";
import logoPicWhite from "../public/logo-white.png";

export default function Header() {
  const {
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    account,
    Moralis,
    deactivateWeb3,
  } = useMoralis();

  const [admin, setAdmin] = useState(false);

  const { runContractFunction: isAdmin } = useWeb3Contract({
    abi: adminAbi,
    contractAddress: adminAddress,
    functionName: "isAdmin",
    params: { adminAddress: account },
  });

  const updateUIValues = async () => {
    const isAdminFromCall = await isAdmin();
    setAdmin(isAdminFromCall);
  };

  useEffect(() => {
    if (
      !isWeb3Enabled &&
      typeof window !== "undefined" &&
      window.localStorage.getItem("provider")
    ) {
      enableWeb3();
      setAdmin(false);
    }
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((newAccount) => {
      console.log(`Account changed to ${newAccount}`);
      if (newAccount == null) {
        window.localStorage.removeItem("provider");
        deactivateWeb3();
        setAdmin(false);
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
      setAdmin(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Navbar admin={admin} />
          <Box sx={{ flexGrow: 1 }} pt={1}>
            <Image src={logoPicWhite} height={80}/>
          </Box>
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
