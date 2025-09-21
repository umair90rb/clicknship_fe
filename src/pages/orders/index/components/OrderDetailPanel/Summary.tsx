import Text from "@/components/Text";
import { Grid } from "@mui/material";

export default function Summary({
  subtotal,
  tax,
  shipping,
  discount,
  total,
}: {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}) {
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
        <Text bold>{subtotal?.toFixed(2)}</Text>
      </Grid>
      <Grid direction={"column"}>
        <Text bold>Tax:</Text>
        <Text bold>{tax?.toFixed(2)}</Text>
      </Grid>
      <Grid direction={"column"}>
        <Text bold>Discount:</Text>
        <Text bold>{discount?.toFixed(2)}</Text>
      </Grid>
      <Grid direction={"column"}>
        <Text bold>Total:</Text>
        <Text bold>{total?.toFixed(2)}</Text>
      </Grid>
      <Grid direction={"column"}>
        <Text bold>Shipping:</Text>
        <Text bold>{shipping?.toFixed(2)}</Text>
      </Grid>
      <Grid direction={"column"}>
        <Text bold>G.Total:</Text>
        <Text bold>{total?.toFixed(2)}</Text>
      </Grid>
    </Grid>
  );
}
