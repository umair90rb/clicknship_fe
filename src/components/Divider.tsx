import Divider from '@mui/material/Divider';

interface HDividerProps {
  text?: string;
}

export default function HDivider({ text = '' }: HDividerProps) {
  return text ? <Divider>{text}</Divider> : <Divider />;
}
