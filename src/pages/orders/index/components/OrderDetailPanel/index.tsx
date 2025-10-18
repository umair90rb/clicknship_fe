import { useGetOrderQuery } from "@/api/orders";
import Text from "@/components/Text";
import type { Order } from "@/types/orders/list";
import type {
  Address,
  Customer,
  Item,
  Log,
  Payment,
  Comment,
} from "@/types/orders/detail";
import type { MRT_Row, MRT_TableInstance } from "material-react-table";
import { Box, Grid } from "@mui/material";
import useDrawer from "@/hooks/useDrawer";
import Tabs from "./Tabs";
import Summary from "./Summary";
import Detail from "./Detail";
import CustomerDetail from "./CustomerDetail";
import PrimaryButton from "@/components/Button";

const statuses: { status: string; color: string }[] = [
  { status: "Payment Pending", color: "info" },
  { status: "Confirm", color: "success" },
  { status: "No Pick", color: "warning" },
  { status: "Cancel", color: "error" },
  { status: "Duplicate", color: "inherit" },
  { status: "Fake Order", color: "secondary" },
];

export default function OrderDetailPanel({
  row,
}: {
  row: MRT_Row<Order>;
  table: MRT_TableInstance<Order>;
}) {
  const orderId: number = row.getValue("id");
  const { drawerWidth } = useDrawer();
  const { error, isError, isFetching } = useGetOrderQuery(orderId, {
    refetchOnMountOrArgChange: false,
  });

  if (isFetching) return <Text>Loading...</Text>;
  if (isError) return <Text>{JSON.stringify(error)}</Text>;

  return (
    <Box
      sx={{ border: "0px solid", maxWidth: `calc(98vw - ${drawerWidth}px)` }}
    >
      {/* Order Detail */}
      <Grid
        sx={{
          backgroundColor: "#F5F5F5",
          p: 1,
          mb: 1,
          flexDirection: "row",
          border: "0px solid",
        }}
      >
        <Detail orderId={orderId as number} />
      </Grid>
      <Grid container spacing={1} border="0px solid">
        {/* Customer Detail */}
        <Grid
          sx={{
            flex: 1,
            backgroundColor: "#F5F5F5",
            p: 2,
            border: "0px solid",
          }}
        >
          <CustomerDetail orderId={orderId as number} />
        </Grid>

        {/* Actions */}
        <Grid
          sx={{
            flex: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "0px solid",
          }}
        >
          <Tabs orderId={orderId as number} />

          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Summary orderId={orderId as number} />
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {statuses.map(({ status, color }) => (
                <PrimaryButton
                  color={color}
                  label={status}
                  onClick={() => {}}
                />
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
