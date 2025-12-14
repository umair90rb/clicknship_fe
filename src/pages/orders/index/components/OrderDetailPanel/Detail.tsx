import { selectOrderById } from "@/api/orders";
import CopyButton from "@/components/CopyButton";
import Text from "@/components/Text";
import { ORDER_STATUSES } from "@/constants/order";
import {  Chip, Grid, type ButtonPropsColorOverrides, type ChipPropsColorOverrides } from "@mui/material";
import { useSelector } from "react-redux";

export default function Detail({ orderId }: { orderId: number }) {
  const order = useSelector(selectOrderById(orderId));
  return <Grid container spacing={2} justifyContent="space-evenly">
    <Grid>
      <Text text="Order Id" />
      <Text text={orderId} />
    </Grid>

    <Grid>
      <CopyButton copyText={order?.orderNumber}><Text text="Order Number" /></CopyButton>
      <Text text={order?.orderNumber} />
    </Grid>

    <Grid>
      <Text text="Order Date" />
      <Text
        text={
          order?.createdAt ? new Date(order.createdAt).toLocaleString() : ""
        }
      />
    </Grid>

    <Grid>
      <Text text="Assigned Date" />
      <Text
        text={
          order?.assignedAt ? new Date(order.assignedAt).toLocaleString() : ""
        }
      />
    </Grid>

    <Grid>
      <Text text="Assigned To" />
      <Text text={`${order?.user?.name || ""} ${order?.user?.email || ""}`} />
    </Grid>

    <Grid>
      <Text text="Channel" />
      <Text text={order?.channel?.name} />
    </Grid>

    <Grid>
      <Text text="Brand" />
      <Text text={order?.brand?.name} />
    </Grid>

    <Grid>
      <Text text="Status" />
      <Chip
        size="small"
        color={
          ORDER_STATUSES.find(({ value }) => value === order?.status)?.color
        }
        label={order?.status}
      />
    </Grid>

    {order?.shipment && <Grid>
      <CopyButton copyText={order?.shipment?.cn}><Text text="CN" /></CopyButton>
      <Text text={order?.shipment?.cn} />
    </Grid>}
  </Grid>;
}
