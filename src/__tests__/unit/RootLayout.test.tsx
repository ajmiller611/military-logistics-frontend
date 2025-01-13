import { render, screen } from '@testing-library/react';
import RootLayout from '@/app/layout';
import theme from '@/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

describe('RootLayout', () => {
  test('should render children inside the layout', () => {
    // Render the RootLayout with some children
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
      { container: document },
    );

    // Check if the child content renders
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('should render theme and CssBaseline correctly', () => {
    // Provide theme and CssBasline to test styles are applied properly
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      </ThemeProvider>,
      { container: document },
    );

    // Test theme is applied
    const body = document.body;
    const fontFamily = window.getComputedStyle(body).fontFamily;
    expect(fontFamily).toContain('Roboto');
    expect(body).toHaveStyle(
      `background-color: ${theme.palette.background.default}`,
    );

    // Test CssBaseline is applied by checking <body> margin
    const margin = window.getComputedStyle(body).margin;
    expect(margin).toBe('0px');
  });
});
