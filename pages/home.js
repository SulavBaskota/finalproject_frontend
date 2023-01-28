import ProTip from "../src/ProTip";
import Link from "../src/Link";
import Copyright from "../src/Copyright";
import { Typography } from "@mui/material";

export default function Home() {
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Next.js example
      </Typography>
      <Link href="/about" color="secondary">
        Go to the about page
      </Link>
      <ProTip />
      <Copyright />
    </>
  );
}
