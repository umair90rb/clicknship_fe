import { Box, Tabs, Tab, AppBar } from "@mui/material";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import TopUp from "./TopUp";
import PaymentHistory from "./PaymentHistory";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function Billing() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box
        sx={{
          bgcolor: "background.paper",
        }}
      >
        {/* <AppBar color="inherit" position="static"> */}
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          //   variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Top-up" {...a11yProps(0)} />
          <Tab label="Payment History" {...a11yProps(1)} />
        </Tabs>
        {/* </AppBar> */}
      </Box>
      <Box sx={{px: 3}} >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <TopUp />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <PaymentHistory />
        </TabPanel>
      </Box>
    </Box>
  );
}
