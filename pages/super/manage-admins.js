import { Typography } from "@mui/material";
import { useEffect, useContext } from "react";
import { RoleContext } from "../../src/Contexts";
import { useRouter } from "next/router";

export default function ManageAdmins() {
  const { role } = useContext(RoleContext);
  const router = useRouter();

  useEffect(() => {
    if (role !== "super") router.push("/404");
  }, [role]);

  return (
    <>
      <Typography variant="h1">Manage Admins</Typography>
    </>
  );
}
