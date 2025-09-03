import PrimarySearchAppBar from "@/components/Appbar";
import ClippedDrawer from "@/components/Drawer";
import useDrawer from "@/hooks/useDrawer";
import { Box, CssBaseline } from "@mui/material";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  width?: number;
  open?: boolean;
}>(({ theme, width }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(0),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${width}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

export default function RootLayout() {
  const { open, drawerWidth, toggleDrawer } = useDrawer();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimarySearchAppBar toggleDrawer={toggleDrawer} />
      <ClippedDrawer
        drawerWidth={drawerWidth}
        open={open}
        toggleDrawer={toggleDrawer}
      />
      <Main open={open} width={drawerWidth}>
        <Toolbar variant="dense" />
        <Outlet />
      </Main>
    </Box>
  );
}
