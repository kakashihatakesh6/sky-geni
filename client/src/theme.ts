import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0e3a8c', // Deep Blue from header
    },
    secondary: {
      main: '#f97316', // Orange accent
    },
    success: {
      main: '#22c55e', // Green for positive trends
    },
    error: {
      main: '#ef4444', // Red for negative trends
    },
    background: {
      default: '#f1f5f9', // Light gray background
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700 }, // Bold headers
    h2: { fontSize: '1.75rem', fontWeight: 700 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.01em' },
    subtitle1: { fontSize: '0.95rem', fontWeight: 500 },
    body2: { fontSize: '0.85rem' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        }
      }
    }
  },
});
