import * as React from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


//Fixed and Cleaned

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

  // Define button styles for each mode
  const lightModeCustomColors = {
    cardBackground: '#f9fafb',
    cardHover: '#374151',
    searchBackground: '#374151',
    // Button colors for light mode
    buttonBackground: '#000000',
    buttonHover: '#1a91da',
    buttonText: '#FFFFFF',
    containedButtonBorder: '#000000',
    containedButtonText: '#000000',
    // Outlined button colors for light mode
    outlinedButtonBorder: '#1DA1F2',
    outlinedButtonText: '#1DA1F2',
    outlinedButtonHoverBg: 'rgba(29, 161, 242, 0.08)',
    outlinedButtonHoverBorder: '#0c7abf',
  };

  const darkModeCustomColors = {
    cardBackground: 'rgb(42 42 47)',
    cardHover: '#374151',
    searchBackground: '#374151',
    // Button colors for dark mode
    buttonBackground: '#000000',
    buttonHover: '#1a91da',
    buttonText: '#FFFFFF',
    containedButtonBorder: '#FFFFFF',
    containedButtonText: '#FFFFFF',
    // Outlined button colors for dark mode
    outlinedButtonBorder: '#1DA1F2',
    outlinedButtonText: '#1DA1F2',
    outlinedButtonHoverBg: 'rgba(29, 161, 242, 0.08)',
    outlinedButtonHoverBorder: '#0c7abf',
  };

  const theme = React.useMemo(
    () => {
      // Select the appropriate custom colors based on mode
      const customColors = mode === 'light' ? lightModeCustomColors : darkModeCustomColors;

      return createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode palette
                primary: {
                  main: '#1DA1F2',
                  contrastText: '#FFFFFF',
                },
                background: {
                  default: '#ffffff',
                  paper: '#ffffff',
                },
                custom: customColors,
              }
            : {
                // Dark mode palette
                primary: {
                  main: '#1DA1F2',
                  contrastText: '#FFFFFF',
                },
                background: {
                  default: '#151a1f',
                  paper: '#151a1f',
                },
                text: {
                  primary: '#ffffff',
                  secondary: '#8899A6',
                },
                custom: customColors,
              }),
        },
        components: {
          MuiButton: {
            styleOverrides: {
              // Contained primary button styling
              containedPrimary: {
                backgroundColor: customColors.buttonBackground,
                color: customColors.buttonText,
                '&:hover': {
                  backgroundColor: customColors.buttonHover,
                },
              },
              // Outlined primary button styling
              outlinedPrimary: {
                borderColor: customColors.outlinedButtonBorder,
                color: customColors.outlinedButtonText,
                '&:hover': {
                  backgroundColor: customColors.outlinedButtonHoverBg,
                  borderColor: customColors.outlinedButtonHoverBorder,
                },
              }
            },
          },
        },
      });
    },
    [mode], // Re-compute the theme only when the mode changes
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
