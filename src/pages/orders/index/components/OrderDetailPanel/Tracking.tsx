import dayjs from "dayjs";
import { SHORT_DATE_FORMAT } from "@/constants/keys";
import { Box } from "@mui/material";
import { selectOrderById } from "@/api/orders";
import { useSelector } from "react-redux";
import { CustomTimeline } from "@/components/CustomTimeline";

export default function Tracking({ orderId }: { orderId: number }) {
  const order = useSelector(selectOrderById(orderId));
  return (
    <Box sx={{ minHeight: 250 }}>
      <CustomTimeline
        items={order?.shipment?.trackingJson || []}
        getDate={(item) => <>{dayjs(item.date).format(SHORT_DATE_FORMAT)}</>}
        getContent={(item) => <>{item.status}</>}
      />
    </Box>
  );
}
