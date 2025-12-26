import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import FeedbackTab from "./FeedbackTab";
import SupportCasesTab from "./SupportCasesTab";
import FeatureRequestsTab from "./FeatureRequestsTab";

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
      id={`support-tabpanel-${index}`}
      aria-labelledby={`support-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `support-tab-${index}`,
    "aria-controls": `support-tabpanel-${index}`,
  };
}

export default function Support() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="support tabs"
        >
          <Tab label="Feedback" {...a11yProps(0)} />
          <Tab label="Support Cases" {...a11yProps(1)} />
          <Tab label="Feature Requests" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <FeedbackTab />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SupportCasesTab />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <FeatureRequestsTab />
      </TabPanel>
    </Box>
  );
}
