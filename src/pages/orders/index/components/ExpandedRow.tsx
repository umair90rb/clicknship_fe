import { useGetOrderQuery } from "@/api/orders";
import Text from "@/components/Text";
import type { Order } from "@/types/order";
import type { MRT_Row, MRT_TableInstance } from "material-react-table";
import {
  Box,
  Button,
  Divider,
  Chip,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

export default function OrderDetailPanel({
  row,
}: {
  row: MRT_Row<Order>;
  table: MRT_TableInstance<Order>;
}) {
  const { data, error, isError, isFetching } = useGetOrderQuery(
    row.getValue("id"),
    {
      refetchOnMountOrArgChange: true,
    }
  );

  if (isFetching) return <Text>Loading...</Text>;
  if (isError) return <Text>{JSON.stringify(error)}</Text>;

  const {
    id,
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
    items,
    delivery,
    logs,
    payments,
    user,
    brand,
  } = data?.data || {};

  return (
    // <Card sx={{ borderRadius: 2, boxShadow: 3, maxWidth: "98vw" }}>
    // {/* <CardContent> */}
    <Grid container spacing={3}>
      {/* Customer Detail */}
      <Grid>
        <Text variant="h6">Customer Detail</Text>
        <Text>Name: {customer?.name}</Text>
        <Text>Email: {customer?.email}</Text>
        <Text>Phone: {customer?.phone}</Text>
        <Text>City: {address?.city}</Text>
        <Text>Country: {address?.country}</Text>
        <Text>Zip: {address?.zip}</Text>
        <Text>Address: {address?.address}</Text>
        <Button variant="contained" size="small" sx={{ mt: 1 }}>
          Save
        </Button>
      </Grid>

      {/* Order Detail */}
      <Grid>
        <Text variant="h6">Order Detail</Text>
        <Text>Date: {new Date(createdAt as string).toLocaleString()}</Text>
        <Text>Status: {status}</Text>
        <Text>
          Tags:{" "}
          {tags?.map((t) => (
            <Chip
              label={t}
              color={t === "Pending" ? "warning" : "success"}
              size="small"
            />
          ))}
        </Text>
        <Divider sx={{ my: 1 }} />
        <Text variant="subtitle1">Items:</Text>
        {items?.map((item, i) => (
          <Box
            key={i}
            sx={{ p: 1, border: "1px solid #ddd", borderRadius: 1, mb: 1 }}
          >
            <Text>{item.name}</Text>
            <Text variant="body2">Barcode: {item.sku}</Text>
            <Text variant="body2">Price: Rs. {item.unitPrice}</Text>
            <Text variant="body2">Qty: {item.quantity}</Text>
            <Text bold>Total: Rs. {item.unitPrice * item.quantity}</Text>
          </Box>
        ))}
      </Grid>

      {/* Actions */}
      <Grid>
        <Text variant="h6">Actions</Text>
        <Text>Subtotal: Rs. {totalAmount}</Text>
        <Text>Shipping: Rs. 0</Text>
        <Text bold>Grand Total: Rs. {totalAmount}</Text>
        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button variant="contained" color="primary">
            Capture Amount
          </Button>
          <Button variant="contained" color="error">
            Cancel
          </Button>
          <Button variant="contained" color="success">
            Verify
          </Button>
          <Button variant="contained" color="warning">
            No Pick
          </Button>
        </Box>
      </Grid>
    </Grid>
    // {/* </CardContent> */}
    // {/* </Card> */}
  );
}
