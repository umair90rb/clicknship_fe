import Button from '@mui/material/Button';

interface PrimaryButtonProps {
  type?: "submit" | "button" | "reset";
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function PrimaryButton({
  type = 'button',
  label = 'Button',
  onClick = () => {},
  disabled = false
}: PrimaryButtonProps) {
  return (
    <Button disabled={disabled} type={type} fullWidth variant="contained" onClick={onClick}>
      {label}
    </Button>
  );
}