import PrimarySearchAppBar from "@/components/Appbar";
import ClippedDrawer from "@/components/Drawer";
import RightSidebar from "@/components/RightSidebar/index";
import useDrawer from "@/hooks/useDrawer";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router";

const Main = styled("main", {
  shouldForwardProp: (prop) =>
    prop !== "miniSidebarWidth" && prop !== "isVisible",
})<{
  miniSidebarWidth?: number;
  isVisible?: boolean;
}>(({ theme, miniSidebarWidth = 0, isVisible }) => {
  const rightSpace = isVisible ? miniSidebarWidth : 0;

  return {
    border: "1px solid",
    marginTop: 48,
    height: `calc(100vh - 48px)`,

    flexGrow: 1,
    minWidth: 0,
    overflow: "auto",

    marginRight: rightSpace,

    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  };
});

export default function RootLayout() {
  const { open, isVisible, drawerWidth, miniSidebarWidth, toggleDrawer } =
    useDrawer();

  return (
    <Box sx={{ display: "flex", width: "100%", overflowX: "hidden" }}>
      <PrimarySearchAppBar toggleDrawer={toggleDrawer} />

      <ClippedDrawer
        drawerWidth={drawerWidth}
        open={open}
        toggleDrawer={toggleDrawer}
      />

      <Main isVisible={isVisible} miniSidebarWidth={miniSidebarWidth}>
        <Toolbar variant="dense" />
        <Outlet />
      </Main>

      <RightSidebar />
    </Box>
  );
}
