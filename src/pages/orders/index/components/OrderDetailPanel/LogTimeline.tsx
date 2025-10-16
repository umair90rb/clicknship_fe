// components/LogTimeline.tsx
import type { Log } from "@/types/orders/detail";
import dayjs from "dayjs";
import { SHORT_DATE_FORMAT } from "@/constants/keys";
import { CustomTimeline } from "@/components/CustomTimeline";
import { Box } from "@mui/material";

export default function LogTimeline({ logs }: { logs: Log[] }) {
  return (
    <Box sx={{ minHeight: 250 }}>
      <CustomTimeline
        items={logs}
        getDate={(log) =>
          log.createdAt ? dayjs(log.createdAt).format(SHORT_DATE_FORMAT) : "-"
        }
        getContent={(log) => log.event}
      />
    </Box>
  );
}
