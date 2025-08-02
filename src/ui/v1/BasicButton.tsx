import Button from '@mui/material/Button';

interface BasicButtonProps {
  text: string;
  onClick: () => void;
  variant: 'contained' | 'outlined' | 'text';
  disabled: boolean;
}

export function BasicButton({
  text,
  onClick,
  disabled,
  variant = 'outlined',
}: BasicButtonProps) {
  return (
    <Button
      title={text}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
    />
  );
}
