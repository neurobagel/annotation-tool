import { Alert, AlertColor, Typography } from '@mui/material';
import React from 'react';

export interface AlertItem {
  id: string;
  severity: AlertColor;
  title: string;
  message: React.ReactNode;
  dataCy?: string;
}

export interface PageAlertProps {
  severity: AlertColor;
  title: string;
  message: React.ReactNode;
  dataCy?: string;
  className?: string;
}

export default function PageAlert({ severity, title, message, dataCy, className }: PageAlertProps) {
  return (
    <Alert severity={severity} data-cy={dataCy} className={className}>
      <Typography variant="h6" className="mb-2 font-bold">
        {title}
      </Typography>
      <Typography variant="body1">{message}</Typography>
    </Alert>
  );
}
