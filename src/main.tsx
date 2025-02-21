import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';
import NBTheme from './theme';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* CSS injection order for MUI and tailwind: https://mui.com/material-ui/guides/interoperability/#tailwind-css */}
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={NBTheme}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
