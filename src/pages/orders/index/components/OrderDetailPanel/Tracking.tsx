import dayjs from "dayjs";
import { SHORT_DATE_FORMAT } from "@/constants/keys";
import { Box, Divider } from "@mui/material";
import { selectOrderById } from "@/api/orders";
import { useSelector } from "react-redux";

export default function Tracking({ orderId }: { orderId: number }) {
  const order = useSelector(selectOrderById(orderId));
  return (
    <Box sx={{ minHeight: 250 }}>
      <div>
        {order?.logs?.map((c) => (
          <div key={c?.id}>
            {c?.event} by <strong>{c?.user?.name || ""}</strong> at{" "}
            {dayjs(c?.createdAt).format(SHORT_DATE_FORMAT)}
            <Divider />
          </div>
        ))}
      </div>
    </Box>
  );
}
