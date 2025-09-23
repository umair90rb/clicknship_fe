// components/LogTimeline.tsx
import type { Log } from "@/types/orders/detail";
import dayjs from "dayjs";
import { SHORT_DATE_FORMAT } from "@/constants/keys";
import { CustomTimeline } from "@/components/CustomTimeline";

export default function LogTimeline({ logs }: { logs: Log[] }) {
  return (
    <CustomTimeline
      items={logs}
      reverse
      getDate={(log) =>
        log.createdAt ? dayjs(log.createdAt).format(SHORT_DATE_FORMAT) : "-"
      }
      getContent={(log) => log.event}
    />
  );
}
