'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#121212',
    },
  },
  typography: {
    fontFamily: `${roboto.style.fontFamily}, 'Helvetica', 'Arial', sans-serif`,
  },
});

export default theme;
