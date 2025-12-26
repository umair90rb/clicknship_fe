import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import OrderReportsTab from "./OrderReportsTab";
import InventoryReportsTab from "./InventoryReportsTab";
import AccountingReportsTab from "./AccountingReportsTab";

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
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `reports-tab-${index}`,
    "aria-controls": `reports-tabpanel-${index}`,
  };
}

export default function Reports() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", px: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="reports tabs"
        >
          <Tab label="Order Reports" {...a11yProps(0)} />
          <Tab label="Inventory Reports" {...a11yProps(1)} />
          <Tab label="Accounting Reports" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <OrderReportsTab />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <InventoryReportsTab />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <AccountingReportsTab />
      </TabPanel>
    </Box>
  );
}
