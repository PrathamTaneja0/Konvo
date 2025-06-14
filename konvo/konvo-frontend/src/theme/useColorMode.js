import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from './ThemeProvider';

// Custom hook to get both the theme and color mode functions
export default function useColorMode() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  return {
    theme,
    colorMode,
    mode: theme.palette.mode
  };
}
