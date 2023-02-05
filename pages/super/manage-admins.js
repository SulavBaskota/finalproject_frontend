import {
  Button,
  Divider,
  TextField,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { useEffect, useContext, useState } from "react";
import { RoleContext } from "../../src/Contexts";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { adminAbi, adminContractAddress } from "../../constants";
import CustomBackdrop from "../../components/CustomBackdrop";
import { useRouter } from "next/router";
import { ethers } from "ethers";

export default function ManageAdmins() {
  const { role } = useContext(RoleContext);
  const { isWeb3Enabled } = useMoralis();
  const router = useRouter();
  const [newAdminAddress, setNewAdminAddress] = useState("");
  const [adminAddressArray, setAdminAddressArray] = useState([]);

  const options = {
    abi: adminAbi,
    contractAddress: adminContractAddress,
    functionName: "",
    params: {},
  };

  useEffect(() => {
    if (!role && !window.localStorage.getItem("provider")) {
      router.push("/401");
      return;
    }
    if (role && role !== "super") {
      router.push("/401");
      return;
    }
    if (role && role === "super") {
      updateUIValues();
      return;
    }
  }, [role]);

  const { runContractFunction, isFetching, isLoading } = useWeb3Contract();

  const updateUIValues = async () => {
    if (isWeb3Enabled) {
      options.functionName = "getAdmins";
      options.params = {};
      const adminAddressArrayFromCall = await runContractFunction({
        params: options,
      });
      setAdminAddressArray(adminAddressArrayFromCall.slice(1));
    }
  };

  const handleRegisterAdmin = async () => {
    if (ethers.utils.isAddress(newAdminAddress)) {
      options.functionName = "registerAdmin";
      options.params = { adminAddress: newAdminAddress };
      await runContractFunction({
        params: options,
        onSuccess: handleRegistrationSuccess,
        onError: (error) => console.log(error),
      });
    }
  };

  const handleRegistrationSuccess = async (tx) => {
    try {
      await tx.wait();
      setNewAdminAddress("");
      updateUIValues();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAdmin = async (address) => {
    options.functionName = "unregisterAdmin";
    options.params = { adminAddress: address };
    await runContractFunction({
      params: options,
      onSuccess: handleDeleteSuccess,
      onError: (error) => console.log(error),
    });
  };

  const handleDeleteSuccess = async (tx) => {
    try {
      await tx.wait();
      updateUIValues();
    } catch (error) {
      console.log(error);
    }
  };

  const ResigterAdmin = () => (
    <>
      <Typography variant="h3">Register Admin</Typography>
      <Divider />
      <Stack spacing={2}>
        <TextField
          required
          id="admin-address"
          label="Admin Address"
          variant="outlined"
          value={newAdminAddress}
          onChange={(e) => setNewAdminAddress(e.target.value)}
          fullWidth
          autoComplete="off"
        />
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleRegisterAdmin}
          >
            Add
          </Button>
        </Box>
      </Stack>
    </>
  );

  const DeleteAdmin = () => (
    <>
      <Typography variant="h3">Delete Admin</Typography>
      <Divider />
      <Stack spacing={2}>
        {adminAddressArray.map((item, index) => (
          <Stack key={index} spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="body2"
                fontWeight="bold"
                textTransform="uppercase"
              >
                {item}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteAdmin(item)}
              >
                Delete
              </Button>
            </Stack>
            <Divider />
          </Stack>
        ))}
      </Stack>
    </>
  );

  return (
    <>
      {(isLoading || isFetching) && (
        <CustomBackdrop display={isLoading || isFetching} />
      )}
      {role && (
        <Stack spacing={2}>
          <ResigterAdmin />
          <Divider />
          {adminAddressArray.length > 0 && <DeleteAdmin />}
        </Stack>
      )}
    </>
  );
}
