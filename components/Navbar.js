import { useContext, useState } from "react";
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AddBoxIcon from "@mui/icons-material/AddBox";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Image from "next/image";
import logoPicBlack from "../public/logo-black.png";
import Link from "../src/Link";
import { RoleContext } from "../src/Contexts";

const UserMenuList = [
  { text: "Home", icon: <HomeIcon />, href: "/" },
  {
    text: "Create Auction",
    icon: <AddBoxIcon />,
    href: "/auction/create-auction",
  },
  { text: "My Watchlist", icon: <WatchLaterIcon />, href: "/my-watchlist" },
];

const AdminMenuList = [
  {
    text: "Verify Auction",
    icon: <CheckBoxIcon />,
    href: "/admin/verify-auction",
  },
  {
    text: "Ship Auction Item",
    icon: <LocalShippingIcon />,
    href: "/admin/ship-auction-item",
  },
];

const SuperAdminMenuList = [
  {
    text: "Manage Admins",
    icon: <ManageAccountsIcon />,
    href: "/super/manage-admins",
  },
];

const CreateList = ({ menuList }) => (
  <List>
    {menuList.map((item) => (
      <ListItem key={item.text} disablePadding>
        <ListItemButton component={Link} noLinkStyle href={item.href}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    ))}
  </List>
);

export default function Navbar() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { role } = useContext(RoleContext);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpenDrawer(open);
  };

  return (
    <div>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={toggleDrawer(true)}
      >
        <MenuIcon fontSize="large" />
      </IconButton>
      <Drawer anchor={"left"} open={openDrawer} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box display="flex" justifyContent="center" py={1}>
            <Image src={logoPicBlack} alt="Website Logo" width={200} />
          </Box>
          <Divider />
          <CreateList menuList={UserMenuList} />
          {(role === "admin" || role === "super") && (
            <>
              <Divider />
              <CreateList menuList={AdminMenuList} />
            </>
          )}
          {role === "super" && (
            <>
              <Divider />
              <CreateList menuList={SuperAdminMenuList} />
            </>
          )}
        </Box>
      </Drawer>
    </div>
  );
}
