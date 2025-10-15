import type { Comment, Item, Log, Payment } from "@/types/orders/detail";
import { Box, Tabs, Tab, AppBar } from "@mui/material";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import ItemsTable from "./ItemsTable";
import PaymentsTable from "./PaymentsTable";
import LogTimeline from "./LogTimeline";
import Comments from "./Comments";
import RemarksAndTags from "./RemarksAndTags";

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

interface OrderTabsProps {
  orderId: number;
  items: Item[];
  payments: Payment[];
  logs: Log[];
  comments: Comment[];
  remarks: string;
  tags: string[];
}

export default function OrderTabs({
  orderId,
  items,
  payments,
  logs,
  comments,
  remarks,
  tags,
}: OrderTabsProps) {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: 250 }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Items" {...a11yProps(0)} />
          <Tab label="Payments" {...a11yProps(1)} />
          <Tab label="Tags & Remarks" {...a11yProps(2)} />
          <Tab label="Comments" {...a11yProps(3)} />
          <Tab label="Order Logs" {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <ItemsTable orderId={orderId} items={items as Item[]} />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <PaymentsTable orderId={orderId} payments={payments as Payment[]} />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <RemarksAndTags orderId={orderId} remarks={remarks} tags={tags} />
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        <Comments orderId={orderId} comments={comments} />
      </TabPanel>
      <TabPanel value={value} index={4} dir={theme.direction}>
        <LogTimeline logs={logs} />
      </TabPanel>
    </Box>
  );
}
