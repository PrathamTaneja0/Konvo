import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from './ThemeProvider';

// Custom hook to access both the current theme and color mode toggler
export default function useColorMode() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  return {
    theme, 
    colorMode, 
    mode: theme.palette.mode // 'light' or 'dark'
  };
}

// Prompt: "How do I implement theme persistence in localStorage?"
// Prompt: "The theme context is not working properly. How can I debug this?"
