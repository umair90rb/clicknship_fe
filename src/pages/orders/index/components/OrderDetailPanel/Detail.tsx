import Text from "@/components/Text";
import type { User } from "@/types/orders/detail";
import { Box, Chip, Stack } from "@mui/material";

export default function Detail({
  orderId,
  orderNumber,
  createdAt,
  user,
  assignedAt,
  brand,
  channel,
  tags,
  status,
}: {
  orderId: number;
  orderNumber?: string;
  createdAt?: string;
  user?: User;
  assignedAt?: string;
  brand?: string;
  channel?: string;
  tags?: string[];
  status?: string;
}) {
  return (
    <Stack justifyContent={"space-evenly"} direction={"row"}>
      {[
        <>
          <Text text="Order Id" />
          <Text text={orderId} />
        </>,
        <>
          <Text text="Order Number" />
          <Text text={orderNumber} />
        </>,
        <>
          <Text text="Order Date" />
          <Text text={createdAt ? new Date(createdAt).toLocaleString() : ""} />
        </>,
        <>
          <Text text="Assigned Date" />
          <Text
            text={assignedAt ? new Date(assignedAt).toLocaleString() : ""}
          />
        </>,
        <>
          <Text text="Assigned To" />
          <Text text={`${user?.name || ""} ${user?.email || ""}`} />
        </>,
        <>
          <Text text="Channel" />
          <Text text={channel} />
        </>,
        <>
          <Text text="Brand" />
          <Text text={brand} />
        </>,
        <>
          <Text text="Status" />
          <Chip
            size="small"
            color={status?.toLowerCase() === "confirmed" ? "success" : "info"}
            label={status}
          />
        </>,
      ].map((row, i) => (
        <Box key={i}>{row}</Box>
      ))}
    </Stack>
  );
}
