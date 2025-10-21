import { selectOrderById } from "@/api/orders";
import Text from "@/components/Text";
import { ORDER_STATUSES } from "@/constants/order";
import { Box, Chip, Stack } from "@mui/material";
import { useSelector } from "react-redux";

export default function Detail({ orderId }: { orderId: number }) {
  const order = useSelector(selectOrderById(orderId));
  return (
    <Stack justifyContent={"space-evenly"} direction={"row"}>
      {[
        <>
          <Text text="Order Id" />
          <Text text={orderId} />
        </>,
        <>
          <Text text="Order Number" />
          <Text text={order?.orderNumber} />
        </>,
        <>
          <Text text="Order Date" />
          <Text
            text={
              order?.createdAt
                ? new Date(order?.createdAt).toLocaleString()
                : ""
            }
          />
        </>,
        <>
          <Text text="Assigned Date" />
          <Text
            text={
              order?.assignedAt
                ? new Date(order?.assignedAt).toLocaleString()
                : ""
            }
          />
        </>,
        <>
          <Text text="Assigned To" />
          <Text
            text={`${order?.user?.name || ""} ${order?.user?.email || ""}`}
          />
        </>,
        <>
          <Text text="Channel" />
          <Text text={order?.channel?.name} />
        </>,
        <>
          <Text text="Brand" />
          <Text text={order?.brand?.name} />
        </>,
        <>
          <Text text="Status" />
          <Chip
            size="small"
            color={
              ORDER_STATUSES.find(({ value }) => value === order?.status)?.color
            }
            label={order?.status}
          />
        </>,
      ].map((row, i) => (
        <Box key={i}>{row}</Box>
      ))}
    </Stack>
  );
}
