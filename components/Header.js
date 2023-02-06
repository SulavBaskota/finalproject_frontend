import { AppBar, Box, Toolbar, Button, Typography } from "@mui/material";
import Navbar from "./Navbar";
import { useEffect, useContext } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { adminAbi, adminContractAddress } from "../constants";
import Image from "next/image";
import logoPicWhite from "../public/logo-white.png";
import { RoleContext } from "../src/Contexts";
import Link from "../src/Link";

export default function Header() {
  const {
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    account,
    Moralis,
    deactivateWeb3,
  } = useMoralis();

  const { role, updateRole } = useContext(RoleContext);

  const { runContractFunction: isAdmin } = useWeb3Contract({
    abi: adminAbi,
    contractAddress: adminContractAddress,
    functionName: "isAdmin",
    params: { adminAddress: account },
  });

  const { runContractFunction: isSuperAdmin } = useWeb3Contract({
    abi: adminAbi,
    contractAddress: adminContractAddress,
    functionName: "isSuperAdmin",
    params: {},
  });

  useEffect(() => {
    if (!isWeb3Enabled && window.localStorage.getItem("provider")) {
      enableWeb3();
    }
    updateUIValues();
  }, [isWeb3Enabled, account]);

  useEffect(() => {
    Moralis.onAccountChanged((newAccount) => {
      if (newAccount == null) {
        window.localStorage.removeItem("provider");
        deactivateWeb3();
      }
    });
  }, []);

  const updateUIValues = async () => {
    if (!isWeb3Enabled) {
      updateRole(null);
      return;
    }
    const isAdminFromCall = await isAdmin();
    if (isAdminFromCall) {
      const isSuperAdminFromCall = await isSuperAdmin();
      isSuperAdminFromCall ? updateRole("super") : updateRole("admin");
    } else {
      updateRole("user");
    }
  };

  const handleConnect = async () => {
    const ret = await enableWeb3();
    if (typeof ret !== "undefined") {
      window.localStorage.setItem("provider", "metamask");
    }
  };

  const handleDisconnect = async () => {
    if (isWeb3Enabled) {
      window.localStorage.removeItem("provider");
      deactivateWeb3();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {role && <Navbar />}
          <Box sx={{ flexGrow: 1 }} pt={1}>
            <Button component={Link} noLinkStyle href="/" disableRipple>
              <Image
                src={logoPicWhite}
                width={200}
                priority
                alt="Website Logo"
              />
            </Button>
          </Box>
          {account ? (
            <>
              <Button color="secondary" onClick={handleDisconnect}>
                <Typography variant="body1">
                  {account.slice(0, 6)}...
                  {account.slice(account.length - 4)}
                </Typography>
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
