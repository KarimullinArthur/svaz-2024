import React, { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, Theme, ThemeProvider, CssBaseline, Button } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Dark and light themes
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

// Context Provider Component
export const ThemeProviderContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme: Theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProviderContext');
  }
  return context;
};

export function ThemeToggleButton() {
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Button variant="contained" onClick={toggleTheme}>
        {isDarkMode ? <DarkMode/> : <LightMode/>}
      </Button>
    </div>
  );
}