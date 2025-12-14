// components/CustomTimeline.tsx
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
import type { ReactNode } from "react";
import Text from "./Text";

interface CustomTimelineProps<T> {
  items: T[];
  getDate: (item: T) => ReactNode;
  getContent: (item: T) => ReactNode;
  reverse?: boolean;
  position?: "left" | "right" | "alternate";
  getDotText?: (item: T) => string;
}

export function CustomTimeline<T>({
  items,
  getDate,
  getContent,
  reverse = false,
  position = "right",
  getDotText,
}: CustomTimelineProps<T>) {
  const data = reverse ? [...items].reverse() : items;

  if(!data.length) {
    return <Text>No data to display</Text>
  }

  return (
    <Timeline
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: {
          flex: 0.2,
        },
      }}
      position={position}
    >
      {data.map((item, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent>{getDate(item)}</TimelineOppositeContent>
          <TimelineSeparator>
            {getDotText ? (
              <TimelineDot
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {getDotText(item)}
              </TimelineDot>
            ) : (
              <TimelineDot />
            )}
            {index < data.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>{getContent(item)}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
