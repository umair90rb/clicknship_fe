import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRightOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeftOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import Calculator from "./Calculator2";
import useDrawer from "@/hooks/useDrawer";

interface Tool {
  id: string;
  title: string;
  Icon: React.ElementType;
}

const tools: Tool[] = [
  {
    id: "calculator",
    title: "Calculator",
    Icon: CalculateOutlinedIcon,
  },
  // Add more tools here (e.g., scratchpad, notes, etc.)
];

// Toggle button that sits at bottom right

const TOGGLE_WIDTH = 40;

const ToggleButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "isVisible",
})(({ theme, isVisible }) => ({
  position: "fixed",
  bottom: 10,
  right: isVisible ? 6 : -(TOGGLE_WIDTH / 2),
  transform: "translateY(-40%)",
  zIndex: theme.zIndex.drawer + 2,

  width: TOGGLE_WIDTH,
  height: 40,

  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],

  borderTopLeftRadius: 28,
  borderBottomLeftRadius: 28,
  borderTopRightRadius: isVisible ? 28 : 0,
  borderBottomRightRadius: isVisible ? 28 : 0,

  paddingLeft: isVisible ? 12 : 6,
  paddingRight: isVisible ? 12 : 18,

  transition: theme.transitions.create(
    ["right", "box-shadow", "border-radius"],
    { duration: theme.transitions.duration.short }
  ),

  "&:hover": {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[6],
    right: isVisible ? 16 : 0, // slide out on hover when hidden
  },

  "& .MuiSvgIcon-root": {
    fontSize: 20,
  },
}));

const MiniSidebar = styled(Box, {
  shouldForwardProp: (prop) => prop !== "sidebarWidth",
})(({ theme, sidebarWidth }) => ({
  position: "fixed",
  top: 48, // Below toolbar
  right: 0,
  bottom: 0,
  width: sidebarWidth,
  backgroundColor: theme.palette.background.paper,
  borderLeft: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: theme.spacing(1),
  zIndex: theme.zIndex.drawer,
}));



// Tool drawer header
const ToolDrawerHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1, 2),
  minHeight: 48,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

// Tool content renderer
function ToolContent({ toolId }: { toolId: string }) {
  switch (toolId) {
    case "calculator":
      return <Calculator />;
    default:
      return (
        <Box sx={{ p: 2 }}>
          <Typography>Tool not found</Typography>
        </Box>
      );
  }
}

export default function RightSidebar() {
  const { toolDrawerWidth, miniSidebarWidth, isVisible, toggleSidebar } = useDrawer();
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const handleToolClick = (tool: Tool) => {
    if (activeTool?.id === tool.id) {
      setActiveTool(null);
    } else {
      setActiveTool(tool);
    }
  };

  const handleCloseToolDrawer = () => {
    setActiveTool(null);
  };

  return (
    <>
      {/* Toggle button at bottom right */}
      <Tooltip
        title={isVisible ? "Hide sidebar" : "Show tools"}
        placement="left"
      >
        {/* <ToggleButton onClick={handleToggle} size="small">
          <AppsOutlinedIcon />
        </ToggleButton> */}
        <ToggleButton isVisible={isVisible} onClick={toggleSidebar}>
          {isVisible ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </ToggleButton>
      </Tooltip>

      {/* Mini sidebar with tool icons */}
      {isVisible && (
        <MiniSidebar sidebarWidth={miniSidebarWidth}>
          {tools.map((tool) => (
            <Tooltip key={tool.id} title={tool.title} placement="left">
              <IconButton
                onClick={() => handleToolClick(tool)}
                sx={{
                  mb: 0.5,
                  bgcolor:
                    activeTool?.id === tool.id
                      ? "action.selected"
                      : "transparent",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <tool.Icon />
              </IconButton>
            </Tooltip>
          ))}
          <Divider sx={{ width: "80%", my: 1 }} />
        </MiniSidebar>
      )}

      {/* Tool drawer that opens when a tool is selected */}
      <Drawer
        anchor="right"
        open={activeTool !== null}
        onClose={handleCloseToolDrawer}
        variant="persistent"
        sx={{
          "& .MuiDrawer-paper": {
            width: toolDrawerWidth,
            right: miniSidebarWidth,
            top: 48,
            height: "calc(100% - 48px)",
          },
        }}
      >
        {activeTool && (
          <>
            <ToolDrawerHeader>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <activeTool.Icon fontSize="small" />
                <Typography variant="subtitle2">{activeTool.title}</Typography>
              </Box>
              <IconButton size="small" onClick={handleCloseToolDrawer}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </ToolDrawerHeader>
            <ToolContent toolId={activeTool.id} />
          </>
        )}
      </Drawer>
    </>
  );
}
