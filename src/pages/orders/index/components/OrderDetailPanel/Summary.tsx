import { selectOrderById } from "@/api/orders";
import Text from "@/components/Text";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";

export default function Summary({ orderId }: { orderId: number }) {
  const order = useSelector(selectOrderById(orderId));
  return (
    <Grid
      sx={{
        display: "flex",
        direction: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "lightblue",
        // border: "1px solid black",
      }}
    >
      <Grid direction={"column"}>
        <Text bold>Subtotal:</Text>
        {/* <Text bold>{order?.items?.reduce((pv, cv) => 0, 0)?.toFixed(2)}</Text> */}
      </Grid>
      <Grid direction={"column"}>
        <Text bold>Tax:</Text>
        <Text bold>{order?.totalTax?.toFixed(2)}</Text>
      </Grid>
      <Grid direction={"column"}>
        <Text bold>Discount:</Text>
        <Text bold>{order?.totalDiscount?.toFixed(2)}</Text>
      </Grid>
      <Grid direction={"column"}>
        <Text bold>Total:</Text>
        <Text bold>{order?.totalAmount?.toFixed(2)}</Text>
      </Grid>
      <Grid direction={"column"}>
        <Text bold>Shipping:</Text>
        <Text bold>{order?.shippingCharges?.toFixed(2)}</Text>
      </Grid>
      <Grid direction={"column"}>
        <Text bold>G.Total:</Text>
        <Text bold>{order?.totalAmount?.toFixed(2)}</Text>
      </Grid>
    </Grid>
  );
}
