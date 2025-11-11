import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import CategoryIcon from "@mui/icons-material/Category";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GroupIcon from "@mui/icons-material/Group";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import StoreIcon from "@mui/icons-material/Store";
import WidgetsIcon from "@mui/icons-material/Widgets";
import LensBlurIcon from "@mui/icons-material/LensBlur";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";

interface MenuItem {
  title: string;
  url?: string;
  Icon?: any;
  secondaryAction?: any;
  onClick?: () => void;
}

interface MenuWithChildren extends MenuItem {
  children?: MenuItem[];
}

const menus: MenuWithChildren[] = [
  {
    title: "Dashboard",
    url: "/",
    Icon: SpaceDashboardIcon,
  },
  {
    title: "Reports",
    url: "/reports",
    Icon: AssessmentIcon,
  },
  {
    title: "Orders",
    children: [
      {
        title: "All Orders",
        url: "/orders",
        Icon: ShoppingCartIcon,
      },
      {
        title: "Create Order",
        url: "/orders/create",
        Icon: AddBoxIcon,
      },
      {
        title: "Order Returns",
        url: "/orders/return",
        Icon: AssignmentReturnIcon,
      },
      {
        title: "Customers",
        url: "/customers",
        Icon: AccountBoxIcon,
      },
      {
        title: "Products",
        url: "/products",
        Icon: WidgetsIcon,
      },
    ],
  },
  {
    title: "Logistics",
    children: [
      {
        title: "Courier Services",
        url: "/courier-services",
        Icon: LocalShippingIcon,
      },
      {
        title: "Cities Management",
        url: "/cities-management",
        Icon: LocationPinIcon,
      },
    ],
  },
  {
    title: "Setting",
    url: "/setting",
    children: [
      // need to separate categories from brands and include units here
      // because in companies mostly Customer agent is the one who manage products/category/units but brands are
      // created/managed by companies other personal so make category based on companies use case.
      {
        title: "Sales Channel",
        url: "/sales-channel",
        Icon: StoreIcon,
      },
      {
        title: "Categories & Brands",
        url: "/categories-and-brands",
        Icon: CategoryIcon,
      },
      {
        title: "Staff & Permissions",
        url: "/staff-and-permissions",
        Icon: GroupIcon,
      },
    ],
  },
];

interface MenuListItemProps {
  menu: MenuItem;
}

function MenuListItem({ menu }: MenuListItemProps) {
  const { url, title, Icon, secondaryAction, onClick } = menu;
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ListItem secondaryAction={secondaryAction} disablePadding dense>
      <ListItemButton
        selected={location?.pathname === url}
        onClick={() => {
          if (onClick) {
            onClick();
          } else {
            navigate(url as string);
          }
        }}
      >
        <ListItemIcon>{Icon && <Icon />}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
}

interface ExpandableMenuListProps {
  menu: MenuWithChildren;
}

function ExpandableMenuList({ menu }: ExpandableMenuListProps) {
  const { title, children } = menu;
  const [open, setOpen] = useState<{ [key: string]: any }>({});
  const handleClick = (title: string) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [title]: !prevOpen[title],
    }));
  };
  return (
    <>
      <ListItemButton onClick={() => handleClick(title)} sx={{}}>
        <ListItemIcon>
          {open[title] ? <ExpandLess /> : <ExpandMore />}
        </ListItemIcon>

        <ListItemText primary={title} />
      </ListItemButton>

      <Collapse
        sx={{ paddingLeft: 1 }}
        in={open[title]}
        timeout="auto"
        unmountOnExit
      >
        <List component="div" disablePadding dense>
          {children?.map((child, index) => (
            <MenuListItem key={index} menu={child} />
          ))}
        </List>
      </Collapse>
      <Divider />
    </>
  );
}

function renderMenu(menus: MenuWithChildren[]) {
  const { logout } = useAuth();
  return (
    <>
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        dense
      >
        {menus.map((menu, index) =>
          "children" in menu ? (
            <ExpandableMenuList key={index} menu={menu} />
          ) : (
            <MenuListItem key={index} menu={menu} />
          )
        )}
      </List>
      <Box flexGrow={1} />
      <MenuListItem
        menu={{ url: "", Icon: LogoutIcon, title: "Logout", onClick: logout }}
      />
      {/* <MenuListItem
        menu={{
          url: "",
          title: "Version",
          Icon: LensBlurIcon,
          secondaryAction: <p>1.0.0</p>,
        }}
      /> */}
    </>
  );
}

interface ClippedDrawerProps {
  open: boolean;
  drawerWidth: number;
  toggleDrawer: () => void;
}

export default function ClippedDrawer({
  open,
  toggleDrawer,
  drawerWidth,
}: ClippedDrawerProps) {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      onClose={toggleDrawer}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar variant="dense" />
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {renderMenu(menus)}
      </Box>
    </Drawer>
  );
}
