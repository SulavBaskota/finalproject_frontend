import * as React from "react";
import { Typography, Button } from "@mui/material";
import ProTip from "../src/ProTip";
import Link from "../src/Link";
import Copyright from "../src/Copyright";

export default function About() {
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Next.js example
      </Typography>
      <Button variant="contained" component={Link} noLinkStyle href="/">
        Go to the main page
      </Button>
      <ProTip />
      <Copyright />
    </>
  );
}
