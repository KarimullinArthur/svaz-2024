import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProviderContext, useThemeContext } from './ThemeContext';
import { Button } from '@mui/material';



function Main() {
  return (
    <ThemeProviderContext>
      <App />
    </ThemeProviderContext>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
