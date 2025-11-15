import Divider from "@mui/material/Divider";

interface HDividerProps {
  text?: string;
  mx?: number;
  my?: number;
}

export default function HDivider({ text = "", mx = 0, my = 0 }: HDividerProps) {
  return text ? (
    <Divider sx={{ mx, my }}>{text}</Divider>
  ) : (
    <Divider sx={{ mx, my }} />
  );
}
