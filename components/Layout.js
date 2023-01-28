import Header from "./Header";
import { Container, Box } from "@mui/material";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <main>{children}</main>
        </Box>
      </Container>
    </>
  );
}
