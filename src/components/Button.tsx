import Button from '@mui/material/Button';

interface PrimaryButtonProps {
  type?: "submit" | "button" | "reset";
  label: string;
  onClick: () => void;
}

export default function PrimaryButton({
  type = 'button',
  label = 'Button',
  onClick = () => {},
}: PrimaryButtonProps) {
  return (
    <Button type={type} fullWidth variant="contained" onClick={onClick}>
      {label}
    </Button>
  );
}