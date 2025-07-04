import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from './ThemeProvider';

// Custom hook to access both the current theme and color mode toggler
export default function useColorMode() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  return {
    theme, // MUI theme object
    colorMode, // { toggleColorMode }
    mode: theme.palette.mode // 'light' or 'dark'
  };
}
