import { Box, styled } from "@mui/material";

const MyBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
});

export default function StyledBox({ children }) {
  return <MyBox>{children}</MyBox>;
}
