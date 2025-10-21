import { useGetOrderQuery, useUpdateOrderStatusMutation } from "@/api/orders";
import Text from "@/components/Text";
import type { Order } from "@/types/orders/list";
import type { MRT_Row, MRT_TableInstance } from "material-react-table";
import { Box, Grid } from "@mui/material";
import useDrawer from "@/hooks/useDrawer";
import Tabs from "./Tabs";
import Summary from "./Summary";
import Detail from "./Detail";
import CustomerDetail from "./CustomerDetail";
import PrimaryButton from "@/components/Button";
import { ORDER_STATUSES } from "@/constants/order";

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
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();

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
              {ORDER_STATUSES.map(({ label, color, value }) => (
                <PrimaryButton
                  disabled={isLoading}
                  color={color}
                  label={label}
                  onClick={() =>
                    updateOrderStatus({ orderId, status: value }).unwrap()
                  }
                />
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
