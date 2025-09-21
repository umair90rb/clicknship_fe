import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import type { Log } from "@/types/orders/detail";
import Text from "@/components/Text";
import dayjs from "dayjs";
import { SHORT_DATE_FORMAT } from "@/constants/keys";
import { Box } from "@mui/material";

interface LogTimelineProps {
  logs: Log[];
}

export default function LogTimeline({ logs }: LogTimelineProps) {
  return (
    <Timeline
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: {
          flex: 0.2,
        },
      }}
      position="right"
    >
      {[...logs].reverse().map((log, index) => (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary">
            {log.createdAt
              ? dayjs(log.createdAt).format(SHORT_DATE_FORMAT)
              : "-"}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            {index < logs.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>{log.event}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
