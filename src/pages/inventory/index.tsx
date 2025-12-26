import { useState, type SyntheticEvent } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import LocationsTab from "./tabs/LocationsTab";
import SuppliersTab from "./tabs/SuppliersTab";
import InventoryItemsTab from "./tabs/InventoryItemsTab";
import MovementsTab from "./tabs/MovementsTab";
import PurchaseOrdersTab from "./tabs/PurchaseOrdersTab";
import TransfersTab from "./tabs/TransfersTab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `inventory-tab-${index}`,
    "aria-controls": `inventory-tabpanel-${index}`,
  };
}

export default function Inventory() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="inventory tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Inventory Items" {...a11yProps(0)} />
          <Tab label="Locations" {...a11yProps(1)} />
          <Tab label="Suppliers" {...a11yProps(2)} />
          <Tab label="Purchase Orders" {...a11yProps(3)} />
          <Tab label="Stock Transfers" {...a11yProps(4)} />
          <Tab label="Movement History" {...a11yProps(5)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <InventoryItemsTab />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <LocationsTab />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <SuppliersTab />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <PurchaseOrdersTab />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <TransfersTab />
      </TabPanel>
      <TabPanel value={tabValue} index={5}>
        <MovementsTab />
      </TabPanel>
    </Box>
  );
}
