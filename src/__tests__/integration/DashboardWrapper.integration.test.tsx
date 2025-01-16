import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardWrapper from '@/components/DashboardWrapper';

describe('DashboardWrapper', () => {
  test('toggles search bar visibility', () => {
    render(
      <DashboardWrapper>
        <div>Test Content</div>
      </DashboardWrapper>,
    );

    // Ensure the search icon is visible initially
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();

    // Click the search button
    fireEvent.click(searchButton);

    // Check if the search bar is visible
    const searchBar = screen.getByPlaceholderText(/search.../i);
    expect(searchBar).toBeInTheDocument();

    // Click the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Ensure the search bar is hidden
    expect(screen.queryByPlaceholderText(/search.../i)).toBeNull();
  });

  test('toggles login and logout buttons', () => {
    render(
      <DashboardWrapper>
        <div>Test Content</div>
      </DashboardWrapper>,
    );

    // Check for the login button initially
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();

    // Click the login button
    fireEvent.click(loginButton);

    // Ensure the logout button and welcome message appear
    expect(screen.getByText(/welcome, user/i)).toBeInTheDocument();
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();

    // Click the logout button
    fireEvent.click(logoutButton);

    // Ensure the login button is visible again
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('should change page title on desktop screen when menu item is clicked', () => {
    render(
      <DashboardWrapper>
        <div>Test Content</div>
      </DashboardWrapper>,
    );

    // Get the "Dashboard" navigation item and click it
    const dashboardItem = screen.getByRole('button', { name: /dashboard/i });
    fireEvent.click(dashboardItem);

    // Verify that the page title updates and the drawer closes
    const pageTitle = screen.getByRole('heading', { name: /dashboard/i });
    expect(pageTitle).toBeInTheDocument();
  });

  test('should change page title and close drawer on mobile screen when menu item is clicked', async () => {
    // Set a mobile screen size
    global.innerWidth = 400;
    global.dispatchEvent(new Event('resize'));

    render(
      <DashboardWrapper>
        <div>Test Content</div>
      </DashboardWrapper>,
    );

    // Simulate clicking the menu button to open the drawer
    const menuButton = screen.getByRole('button', { name: /open drawer/i });
    fireEvent.click(menuButton);

    // Get the "Dashboard" navigation item and click it
    const dashboardItem = screen.getByRole('button', { name: /dashboard/i });
    fireEvent.click(dashboardItem);

    // Verify that the page title updates and the drawer closes
    const pageTitle = screen.getByRole('heading', { name: /dashboard/i });
    expect(pageTitle).toBeInTheDocument();

    // Get the drawer and having attribute 'aria-hidden' does prove it is in a closed state
    const drawer = await screen.findByTestId('drawer');
    expect(drawer).toHaveAttribute('aria-hidden');

    // For extra verification the drawer is closed, MuiPaper is the content area of the drawer
    // and having visibility being set to hidden also proves the drawer is closed.
    await waitFor(() => {
      const drawerPaper = drawer.querySelector('.MuiPaper-root');
      if (drawerPaper) {
        const styles = getComputedStyle(drawerPaper);
        expect(styles.visibility).toBe('hidden');
      } else {
        throw new Error('Drawer paper not found');
      }
    });

    // Clean up: restore the original screen size after the test
    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
  });
});
