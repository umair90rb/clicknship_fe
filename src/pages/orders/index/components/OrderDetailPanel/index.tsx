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

export default function OrderDetailPanel({
  row,
}: {
  row: MRT_Row<Order>;
  table: MRT_TableInstance<Order>;
}) {
  const { drawerWidth } = useDrawer();
  const { data, error, isError, isFetching } = useGetOrderQuery(
    row.getValue("id"),
    {
      refetchOnMountOrArgChange: false,
    }
  );

  if (isFetching) return <Text>Loading...</Text>;
  if (isError) return <Text>{JSON.stringify(error)}</Text>;

  const {
    id: orderId,
    orderNumber,
    createdAt,
    status,
    remarks,
    tags,
    totalAmount,
    totalDiscount,
    totalTax,
    assignedAt,
    courerService,
    customer,
    address,
    channel,
    comments,
    items,
    delivery,
    shippingCharges,
    logs,
    payments,
    user,
    brand,
  } = data?.data || {};

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
        <Detail
          orderId={orderId as number}
          orderNumber={orderNumber}
          channel={channel?.name}
          brand={brand?.name}
          createdAt={createdAt}
          user={user}
          assignedAt={assignedAt}
          status={status}
          tags={tags}
        />
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
          <CustomerDetail
            orderId={orderId as number}
            customer={customer as Customer}
            address={address as Address}
            shippingCharges={shippingCharges as number}
          />
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
          <Tabs
            orderId={orderId as number}
            items={items as Item[]}
            payments={payments as Payment[]}
            logs={logs as Log[]}
            comments={comments as Comment[]}
            note={remarks as string}
            tags={tags as string[]}
          />

          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Summary
              subtotal={0}
              tax={totalTax || 0}
              shipping={0}
              discount={totalDiscount || 0}
              total={totalAmount || 0}
            />
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <PrimaryButton
                color="info"
                label="Payment Pending"
                onClick={() => {}}
              />
              <PrimaryButton
                color="success"
                label="Confirm"
                onClick={() => {}}
              />
              <PrimaryButton
                color="warning"
                label=" No Pick"
                onClick={() => {}}
              />
              <PrimaryButton color="error" label="Cancel" onClick={() => {}} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
