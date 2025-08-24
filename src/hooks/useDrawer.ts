import { useState } from "react";

export default function useDrawer(){
    const drawerWidth = 240;
    const [open, setOpen] = useState(true);

    const toggleDrawer = () => setOpen(!open);


    return {toggleDrawer, open, drawerWidth}
}