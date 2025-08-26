import Typography from '@mui/material/Typography';
import type { PropsWithChildren } from 'react';

interface TextProps {
  text?: string;
  variant?:
    | 'body1'
    | 'body2'
    | 'button'
    | 'caption'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'inherit'
    | 'overline'
    | 'subtitle1'
    | 'subtitle2';
  textAlign?: 'center' | 'start' | 'end';
}

export default function Text({
  text,
  variant = 'body1',
  textAlign = 'start',
  children,
}: PropsWithChildren<TextProps>) {
  return (
    <Typography component="p" variant={variant} sx={{ textAlign }}>
      {text || children}
    </Typography>
  );
}
