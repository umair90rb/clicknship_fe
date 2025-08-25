import Box from '@mui/material/Box';
import * as React from 'react';

export default function FormContainer({ children, ...props }: React.PropsWithChildren) {
  return (
    <Box
      component="form"
      noValidate
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 2,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}