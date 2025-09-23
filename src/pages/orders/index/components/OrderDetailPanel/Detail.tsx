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
    <>
      <Text bold>Order Detail</Text>
      <Stack spacing={1}>
        {[
          <Text>Order Id: {orderId}</Text>,
          <Text>Order Number: {orderNumber}</Text>,
          <Text>
            Order Date: <br />
            {createdAt ? new Date(createdAt).toLocaleString() : ""}
          </Text>,
          <Text>
            Assigned To: {user?.name} {user?.email}
          </Text>,
          <Text>
            Assigned At:
            <br />
            {assignedAt ? new Date(assignedAt).toLocaleString() : ""}
          </Text>,
          <Text>Channel: {channel}</Text>,
          <Text>Brand: {brand}</Text>,
          <Text>
            Status:{" "}
            <Chip
              size="small"
              color={status?.toLowerCase() === "confirmed" ? "success" : "info"}
              label={status}
            />
          </Text>,
          <Text>
            Tags:{" "}
            {tags?.map((t) => (
              <Chip
                component={"p"}
                key={t}
                variant="outlined"
                label={t}
                size="small"
                sx={{ mr: 0.5 }}
              />
            ))}
          </Text>,
        ].map((row, i) => (
          <Box
            key={i}
            sx={{
              p: 1,
              bgcolor: "grey.300",
            }}
          >
            {row}
          </Box>
        ))}
      </Stack>
    </>
  );
}
