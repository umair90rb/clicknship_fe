import { createContext, useState, type ReactNode } from "react";

interface DrawerContextType {
  // Left drawer
  open: boolean;
  drawerWidth: number;
  toggleDrawer: () => void;
  // Right sidebar
  isVisible: boolean;
  miniSidebarWidth: number;
  toolDrawerWidth: number;
  toggleSidebar: () => void;
}

export const DrawerContext = createContext<DrawerContextType | null>(null);

interface DrawerProviderProps {
  children: ReactNode;
}

export function DrawerProvider({ children }: DrawerProviderProps) {
  const drawerWidth = 240;
  const miniSidebarWidth = 52;
  const toolDrawerWidth = 300;

  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleDrawer = () => setOpen((prev) => !prev);
  const toggleSidebar = () => setIsVisible((prev) => !prev);

  return (
    <DrawerContext.Provider
      value={{
        open,
        drawerWidth,
        toggleDrawer,
        isVisible,
        miniSidebarWidth,
        toolDrawerWidth,
        toggleSidebar,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}
