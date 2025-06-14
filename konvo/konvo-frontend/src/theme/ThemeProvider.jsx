import * as React from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a theme context
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

export default function ThemeProvider({ children }) {
  // Use localStorage to persist theme preference if available
  const storedMode = localStorage.getItem('colorMode');
  const [mode, setMode] = React.useState(storedMode || 'light');

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('colorMode', newMode);
          return newMode;
        });
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode palette
                primary: {
                  main: '#1DA1F2',
                  contrastText: '#FFFFFF', // Ensures text on primary buttons is white
                },
                background: {
                  // default: '#f5f5f5',
                  default: '#ffffff',
                  paper: '#ffffff',
                },

                  custom: {
                      cardBackground: '#f9fafb', // dark gray
                      cardHover: '#374151', // darker gray
                      searchBackground: '#374151',
                  }


              }
            : {
                // Dark mode palette
                primary: {
                  main: '#1DA1F2',
                  contrastText: '#FFFFFF', // Ensures text on primary buttons is white

                },
                background: {
                  default: '#151a1f',
                  paper: '#151a1f',
                },
                text: {
                  primary: '#ffffff',
                  secondary: '#8899A6',
                },
                  custom: {
                      // cardBackground: '#1f2937', // dark gray
                      cardBackground: 'rgb(42 42 47)', // dark gray

                      cardHover: '#374151', // darker gray
                      searchBackground: '#374151',
                  }

              }),
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ColorModeContext.Provider>
  );
}
