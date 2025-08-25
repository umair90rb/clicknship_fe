import Link from '@mui/material/Link';

interface LinkButtonProps {
    label: string;
    onClick: () => void;
}

export default function LinkButton({
  label = 'Link Button',
  onClick = () => {},
}: LinkButtonProps) {
  return (
    <Link
      component="button"
      type="button"
      onClick={onClick}
      variant="body2"
      sx={{ alignSelf: 'center' }}
    >
      {label}
    </Link>
  );
}
