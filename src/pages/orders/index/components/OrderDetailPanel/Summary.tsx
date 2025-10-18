import { selectOrderById } from "@/api/orders";
import Text from "@/components/Text";
import type { Item } from "@/types/orders/detail";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";

const toFixed = (amount?: number | null): number => +(amount || 0).toFixed(2);

const itemTotal = (item: Item): number =>
  item.quantity * item.unitPrice - item.discount;

const itemsTotalAndDiscount = (items: Item[] = []): [number, number] =>
  items?.reduce(
    (pv: [number, number], cv: Item) => [
      itemTotal(cv) + pv[0],
      cv.discount + pv[1],
    ],
    [0, 0]
  );

export default function Summary({ orderId }: { orderId: number }) {
  const order = useSelector(selectOrderById(orderId));

  const [total, discount] = itemsTotalAndDiscount(order?.items);
  const tax = toFixed(order?.totalTax);
  const shipping = toFixed(order?.shippingCharges);

  return (
    <Grid
      sx={{
        display: "flex",
        direction: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "lightblue",
      }}
    >
      <Grid direction={"column"}>
        <Text bold>Subtotal</Text>
        <Text bold>Rs.{total}</Text>
      </Grid>
      <Grid direction={"column"}>
        <Text bold>Tax</Text>
        <Text bold>Rs.{tax}</Text>
      </Grid>
      <Grid direction={"column"}>
        <Text bold>Shipping</Text>
        <Text bold>Rs.{shipping}</Text>
      </Grid>
      <Grid direction={"column"}>
        <Text bold>T.Discount</Text>
        <Text bold>Rs.{discount}</Text>
      </Grid>
      <Grid direction={"column"}>
        <Text bold>G.Total</Text>
        <Text bold>Rs.{total + shipping + tax - discount}</Text>
      </Grid>
    </Grid>
  );
}
