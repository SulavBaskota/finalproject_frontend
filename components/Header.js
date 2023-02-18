import { useState, useEffect, useContext } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import {
  Box,
  Button,
  Alert,
  AppBar,
  Toolbar,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CloseIcon from "@mui/icons-material/Close";
import Link from "../src/Link";
import Image from "next/image";
import { RoleContext } from "../src/Contexts";
import Navbar from "./Navbar";
import { adminAbi, adminContractAddress } from "../constants";
import logoPicWhite from "../public/logo-white.png";

export default function Header() {
  const {
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    account,
    Moralis,
    deactivateWeb3,
    chainId: chainIdHex,
  } = useMoralis();

  const chainId = parseInt(chainIdHex);

  const [open, setOpen] = useState(false);

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
  }, [isWeb3Enabled, account, chainId]);

  useEffect(() => {
    const unsubscribe = Moralis.onAccountChanged((newAccount) => {
      if (newAccount == null) {
        window.localStorage.removeItem("provider");
        deactivateWeb3();
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUIValues = async () => {
    if (!isWeb3Enabled) {
      updateRole(null);
      return;
    }
    if (chainId !== 1337 && chainId !== 31337) {
      setOpen(true);
      return;
    }
    setOpen(false);
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
      <Collapse in={open}>
        <Alert
          severity="info"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Please connect to Ganache chain
        </Alert>
      </Collapse>
    </Box>
  );
}
