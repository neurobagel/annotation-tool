import { createTheme } from '@mui/material';

const NBTheme = createTheme({
  palette: {
    primary: {
      light: '#F5A89B',
      main: '#D9748D',
      dark: '#A8556F',
      contrastText: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default NBTheme;
